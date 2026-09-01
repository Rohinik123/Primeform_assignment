# VMC Operator HMI

## Overview

A production-quality Human-Machine Interface (HMI) for a single VMC
(Vertical Machining Center) operator. The application walks the operator
through the machine startup workflow — **Power On → Machine Checks →
Tools → Workpiece → Ready → Running** — one stage at a time, with no
way to skip ahead. Every workflow rule is enforced by the backend, not
just the UI, and the operator's progress is persisted so a page refresh
(or a lost connection) never loses their place.

This is a technical assignment build: one machine, one operator, one
preloaded manufacturing scenario. There is no authentication, no
multi-job management, and no analytics dashboard — deliberately, to keep
the interface focused the way a real shop-floor HMI would be.

## Features

- Sequential machine startup workflow enforced by a server-side state machine
- Machine safety checklist (6 checks) with individual confirmation
- Required tools checklist (5 tools) with per-tool confirmation
- Workpiece setup checklist (fixture, orientation, clamping, material, drawing, work offset)
- Ready review with a consolidated summary and a prominent READY indicator
- Simulated operation with a time-based progress bar, Start/Stop control, and restart support
- Full persistence in SQLite — refreshing mid-operation restores the exact state, including in-progress percentage
- Backend-enforced validation: stage skipping, out-of-order confirmations, and invalid operation transitions are all rejected with clear error messages
- Responsive, high-contrast, touch-friendly industrial UI (desktop → tablet → mobile)
- Accessible: semantic HTML, keyboard navigation, visible focus states, ARIA labels, status never conveyed by color alone

## Tech Stack

**Frontend:** React + TypeScript + Vite + Tailwind CSS + Lucide React

**Backend:** Node.js + Express + TypeScript + REST API

**Database:** SQLite + Prisma ORM

## Project Structure

```
Primeform_assignment/
├── backend/              Express API, Prisma schema, seed data
│   ├── prisma/
│   ├── src/
│   │   ├── routes/       One file per REST resource, wires a path to a controller
│   │   ├── controllers/  Request handlers — the actual logic per route
│   │   ├── db.ts         Prisma client + shared state-reading helpers
│   │   ├── workflow.ts   Stage order and progress calculation (pure functions)
│   │   ├── errors.ts     ApiError class
│   │   ├── middleware/   Centralized error handling
│   │   └── server.ts     App entrypoint
│   └── package.json
├── frontend/             React app
│   └── src/
│       ├── components/   Header, ProgressSteps, Checklist, ToolList, WorkpieceSetup,
│       │                 ReadyReview, OperationPanel, StatusBadge, ConfirmButton...
│       ├── pages/        HMI.tsx (composition root)
│       ├── hooks/        useWorkflow.ts (state, polling, actions)
│       ├── services/     api.ts (fetch wrapper, centralized error handling)
│       └── types/        Shared workflow types
├── render.yaml           Render deployment blueprint for the backend
└── package.json          Root workspace scripts
```

## Local Setup

Requires Node.js 18.18+ and npm 10+.

### 1. Install dependencies (installs both workspaces)

```bash
npm install
```

### 2. Configure environment variables

```bash
cp backend/.env.example backend/.env
cp frontend/.env.example frontend/.env
```

The defaults already point the frontend at `http://localhost:4000`, so
no edits are required for local development.

### 3. Create and seed the database

```bash
cd backend
npx prisma migrate dev --name init
cd ..
npm run db:seed
```

(`prisma migrate dev` also runs on first `npm install` if you use
`npx prisma migrate deploy` in CI — the two-step version above is the
one to run once, locally, the first time.)

### 4. Start both servers

```bash
npm run dev
```

This runs the backend (`http://localhost:4000`) and frontend
(`http://localhost:5173`) concurrently. Open
`http://localhost:5173` in a browser.

**Running them separately**, if you prefer two terminals:

```bash
# Terminal 1
cd backend && npm run dev

# Terminal 2
cd frontend && npm run dev
```

### Resetting the demo

To wipe confirmations and return to the start of the scenario:

```bash
curl -X POST http://localhost:4000/api/reset
```

(or re-run `npm run db:seed`, which does a full destructive reseed).

## API

All endpoints are prefixed with `/api`. Responses are JSON. Errors
return `{ "error": "<message>" }` with an appropriate HTTP status.

| Method | Path | Description |
|---|---|---|
| GET | `/api/health` | Liveness check |
| GET | `/api/job` | The preloaded job/scenario details |
| GET | `/api/state` | Full snapshot: job, machine checks, tools, workpiece checks, workflow (stage, operation status, progress) |
| POST | `/api/stage/next` | Advances to the **immediate next** stage, after verifying every requirement of the current stage is met. Rejects the move otherwise (`409`). |
| PUT | `/api/machine-checks/:id/confirm` | Confirms one machine check. Only allowed while `currentStage === "MACHINE_CHECKS"` (`409` otherwise). Idempotent. |
| PUT | `/api/tools/:id/confirm` | Confirms one tool. Only allowed while `currentStage === "TOOLS"`. Idempotent. |
| PUT | `/api/workpiece-checks/:id/confirm` | Confirms one workpiece setup item. Only allowed while `currentStage === "WORKPIECE"`. Idempotent. |
| POST | `/api/operation/start` | Starts the simulated operation. Requires `currentStage === "OPERATION"` and re-verifies machine/tools/workpiece completion server-side, regardless of what the client claims (`409` if not ready, or if already `RUNNING`). |
| POST | `/api/operation/stop` | Stops a running operation, preserving the progress reached at the moment of stop. `409` if not currently running. |
| POST | `/api/reset` | Resets all confirmations and the workflow stage back to `MACHINE_CHECKS`; job data is untouched. |

### State machine rules (enforced server-side)

```
MACHINE_CHECKS → TOOLS → WORKPIECE → READY → OPERATION
```

- `POST /api/stage/next` only ever advances one stage at a time — there's
  no way to name a target stage, so skipping or jumping backward isn't
  even expressible through the API. It's rejected (`409`) if the current
  stage isn't fully confirmed yet.
- Confirming a check/tool/workpiece item is only accepted while the
  workflow is currently on that item's stage.
- `POST /api/operation/start` independently re-checks that all machine
  checks, tools, and workpiece items are confirmed before allowing the
  transition to `RUNNING` — it does not trust the stage flag alone.
- Operation progress is computed from elapsed wall-clock time on every
  read (not a server timer), so it survives a server restart or a page
  refresh mid-run without drifting.
- From `STOPPED`, the operator can start again (progress resets to 0%);
  starting while already `RUNNING` is rejected.

## Demo Scenario

The application preloads one realistic VMC job:

| Field | Value |
|---|---|
| Operation | Aluminum Housing Precision Milling |
| Quantity | 1 |
| Material | Aluminum 6061-T6 |
| Drawing Revision | REV-C |
| CNC Program | VMC-AL-HOUSING-042 |
| Program Revision | REV-03 |
| Fixture | 4-Jaw Precision Fixture |
| Work Offset | G54 |

**Machine checks:** Power/control available, E-stop released,
Guard/door closed, No active alarm, Lubrication/coolant ready,
Reference return complete.

**Tools:** T01 Ø10mm Carbide End Mill, T02 Ø6mm Carbide End Mill,
T03 Ø20mm Face Mill, T04 6mm Spot Drill, T05 Ø5mm Drill.

**Workpiece setup:** Fixture installed, orientation verified, clamped,
material verified, drawing revision verified, G54 offset verified.

## Deployment

The app deploys as two independent services plus a persistent SQLite
volume for the backend.

### Backend → Render

A `render.yaml` blueprint is included at the repo root. In the Render
dashboard: **New → Blueprint**, point it at this repository, and Render
will provision the web service defined there, including a 1GB
persistent disk mounted at `/var/data` (so the SQLite file survives
restarts and deploys).

- `startCommand` runs `prisma migrate deploy`, then an **idempotent**
  seed step that only populates the demo data if the database is empty
  (so redeploys never wipe an operator's in-progress state), then
  starts the server.
- Set the `CORS_ORIGIN` environment variable to your deployed frontend
  URL (Render will prompt for this since it's marked `sync: false`).
- Health check path: `/api/health`.

Railway works equivalently: point it at `backend/` as the root
directory, add a persistent volume mounted at the path used in
`DATABASE_URL`, and use `npm run deploy:start` as the start command.

### Frontend → Vercel

Import the repository into Vercel, set the project root to `frontend/`.
A `vercel.json` is included with the build command and output
directory. Set the environment variable:

```
VITE_API_URL=https://<your-backend-url>
```

Netlify works the same way — root directory `frontend`, build command
`npm run build`, publish directory `dist`, and the same
`VITE_API_URL` environment variable.

No `localhost` URLs are hardcoded anywhere in the frontend — the API
base URL is always read from `VITE_API_URL` at build time
([frontend/src/services/api.ts](frontend/src/services/api.ts)).

## Environment Variables

**Backend** (`backend/.env`, see `backend/.env.example`):

| Variable | Description |
|---|---|
| `PORT` | Port the API listens on (default `4000`) |
| `CORS_ORIGIN` | Allowed origin for browser requests (the frontend URL) |
| `DATABASE_URL` | Prisma SQLite datasource, e.g. `file:./dev.db` |

**Frontend** (`frontend/.env`, see `frontend/.env.example`):

| Variable | Description |
|---|---|
| `VITE_API_URL` | Base URL of the backend API, no trailing slash |

No secrets are committed to the repository; both `.env` files are
git-ignored, with `.env.example` documenting the required shape.
