/*
  Warnings:

  - Added the required column `teleconsultationId` to the `Appointment` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE `appointment` ADD COLUMN `teleconsultationId` INTEGER NOT NULL;

-- CreateIndex
CREATE INDEX `Appointment_teleconsultationId_idx` ON `Appointment`(`teleconsultationId`);
