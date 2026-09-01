-- CreateTable
CREATE TABLE "Job" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "operationName" TEXT NOT NULL,
    "quantity" INTEGER NOT NULL,
    "material" TEXT NOT NULL,
    "drawingRevision" TEXT NOT NULL,
    "cncProgram" TEXT NOT NULL,
    "programRevision" TEXT NOT NULL,
    "fixture" TEXT NOT NULL,
    "workOffset" TEXT NOT NULL
);

-- CreateTable
CREATE TABLE "MachineCheck" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "key" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "order" INTEGER NOT NULL,
    "confirmed" BOOLEAN NOT NULL DEFAULT false
);

-- CreateTable
CREATE TABLE "Tool" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "toolNumber" TEXT NOT NULL,
    "type" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "quantity" INTEGER NOT NULL DEFAULT 1,
    "cncProgram" TEXT NOT NULL,
    "programRev" TEXT NOT NULL,
    "order" INTEGER NOT NULL,
    "confirmed" BOOLEAN NOT NULL DEFAULT false
);

-- CreateTable
CREATE TABLE "WorkpieceCheck" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "key" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "order" INTEGER NOT NULL,
    "confirmed" BOOLEAN NOT NULL DEFAULT false
);

-- CreateTable
CREATE TABLE "WorkflowState" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "currentStage" TEXT NOT NULL DEFAULT 'MACHINE_CHECKS',
    "operationStatus" TEXT NOT NULL DEFAULT 'READY',
    "progress" INTEGER NOT NULL DEFAULT 0,
    "operationStartedAt" DATETIME,
    "updatedAt" DATETIME NOT NULL
);

-- CreateIndex
CREATE UNIQUE INDEX "MachineCheck_key_key" ON "MachineCheck"("key");

-- CreateIndex
CREATE UNIQUE INDEX "Tool_toolNumber_key" ON "Tool"("toolNumber");

-- CreateIndex
CREATE UNIQUE INDEX "WorkpieceCheck_key_key" ON "WorkpieceCheck"("key");
