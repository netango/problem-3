/*
  Warnings:

  - You are about to drop the column `diagnosis` on the `referrals` table. All the data in the column will be lost.
  - You are about to drop the column `notes` on the `referrals` table. All the data in the column will be lost.
  - You are about to drop the column `reason` on the `referrals` table. All the data in the column will be lost.
  - Added the required column `chiefComplaint` to the `referrals` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "patients" ADD COLUMN "latitude" REAL;
ALTER TABLE "patients" ADD COLUMN "longitude" REAL;

-- AlterTable
ALTER TABLE "specialists" ADD COLUMN "avgWaitDays" INTEGER DEFAULT 0;
ALTER TABLE "specialists" ADD COLUMN "completionRate" REAL DEFAULT 0;
ALTER TABLE "specialists" ADD COLUMN "latitude" REAL;
ALTER TABLE "specialists" ADD COLUMN "longitude" REAL;
ALTER TABLE "specialists" ADD COLUMN "nextAvailableDate" DATETIME;

-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_referrals" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "patientId" TEXT NOT NULL,
    "doctorId" TEXT NOT NULL,
    "specialistId" TEXT,
    "specialization" TEXT NOT NULL,
    "chiefComplaint" TEXT NOT NULL,
    "clinicalNotes" TEXT,
    "urgency" TEXT NOT NULL,
    "status" TEXT NOT NULL DEFAULT 'PENDING_SELECTION',
    "matchedSpecialists" TEXT,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    CONSTRAINT "referrals_patientId_fkey" FOREIGN KEY ("patientId") REFERENCES "patients" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "referrals_doctorId_fkey" FOREIGN KEY ("doctorId") REFERENCES "doctors" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "referrals_specialistId_fkey" FOREIGN KEY ("specialistId") REFERENCES "specialists" ("id") ON DELETE SET NULL ON UPDATE CASCADE
);
INSERT INTO "new_referrals" ("createdAt", "doctorId", "id", "patientId", "specialistId", "specialization", "status", "updatedAt", "urgency") SELECT "createdAt", "doctorId", "id", "patientId", "specialistId", "specialization", "status", "updatedAt", "urgency" FROM "referrals";
DROP TABLE "referrals";
ALTER TABLE "new_referrals" RENAME TO "referrals";
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
