import { PrismaClient } from "@prisma/client";

export const JOB = {
  operationName: "Aluminum Housing Precision Milling",
  quantity: 1,
  material: "Aluminum 6061-T6",
  drawingRevision: "REV-C",
  cncProgram: "VMC-AL-HOUSING-042",
  programRevision: "REV-03",
  fixture: "4-Jaw Precision Fixture",
  workOffset: "G54",
};

export const MACHINE_CHECKS = [
  {
    key: "power",
    name: "Power/control available",
    description: "Machine control unit is powered and responsive.",
  },
  {
    key: "estop",
    name: "E-stop released",
    description: "Emergency stop button is released and machine is clear to move.",
  },
  {
    key: "guard",
    name: "Guard/door closed",
    description: "Safety guard/door is fully closed and interlocked.",
  },
  {
    key: "alarm",
    name: "No active alarm",
    description: "Control panel shows no active machine alarms or faults.",
  },
  {
    key: "coolant",
    name: "Lubrication/coolant ready",
    description: "Coolant level and lubrication system are ready for operation.",
  },
  {
    key: "reference",
    name: "Reference return complete",
    description: "Machine axes have completed reference (home) return.",
  },
];

export const TOOLS = [
  { toolNumber: "T01", type: "Carbide End Mill", description: "Ø10 mm Carbide End Mill" },
  { toolNumber: "T02", type: "Carbide End Mill", description: "Ø6 mm Carbide End Mill" },
  { toolNumber: "T03", type: "Face Mill", description: "Ø20 mm Face Mill" },
  { toolNumber: "T04", type: "Spot Drill", description: "6 mm Spot Drill" },
  { toolNumber: "T05", type: "Drill", description: "Ø5 mm Drill" },
];

export const WORKPIECE_CHECKS = [
  {
    key: "fixture",
    name: "Fixture installed",
    description: "4-Jaw Precision Fixture is installed and secured on the table.",
  },
  {
    key: "orientation",
    name: "Workpiece orientation verified",
    description: "Reference face toward operator side. Located against fixture datum.",
  },
  {
    key: "clamped",
    name: "Workpiece clamped",
    description: "Workpiece is secured firmly in the fixture; all clamps engaged.",
  },
  {
    key: "material",
    name: "Material verified",
    description: "Material confirmed as Aluminum 6061-T6.",
  },
  {
    key: "drawing",
    name: "Drawing revision verified",
    description: "Drawing revision REV-C confirmed against workpiece.",
  },
  {
    key: "offset",
    name: "G54 work offset verified",
    description: "G54 work offset confirmed and set for this operation.",
  },
];

/**
 * `reset: true` wipes and recreates the demo scenario (used by the local `db:seed` command).
 * `reset: false` only seeds when the database is empty, so production restarts never wipe
 * an operator's in-progress state.
 */
export async function seedDatabase(prisma: PrismaClient, { reset }: { reset: boolean }) {
  if (!reset) {
    const existing = await prisma.job.findFirst();
    if (existing) {
      console.log("Database already seeded; skipping.");
      return;
    }
  } else {
    await prisma.job.deleteMany();
    await prisma.machineCheck.deleteMany();
    await prisma.tool.deleteMany();
    await prisma.workpieceCheck.deleteMany();
    await prisma.workflowState.deleteMany();
  }

  await prisma.job.create({ data: JOB });

  for (let i = 0; i < MACHINE_CHECKS.length; i++) {
    await prisma.machineCheck.create({ data: { ...MACHINE_CHECKS[i], order: i } });
  }

  for (let i = 0; i < TOOLS.length; i++) {
    await prisma.tool.create({
      data: {
        ...TOOLS[i],
        quantity: 1,
        cncProgram: JOB.cncProgram,
        programRev: JOB.programRevision,
        order: i,
      },
    });
  }

  for (let i = 0; i < WORKPIECE_CHECKS.length; i++) {
    await prisma.workpieceCheck.create({ data: { ...WORKPIECE_CHECKS[i], order: i } });
  }

  await prisma.workflowState.create({
    data: { currentStage: "MACHINE_CHECKS", operationStatus: "READY", progress: 0 },
  });

  console.log("Database seeded.");
}
