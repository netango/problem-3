-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_doctors" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "userId" TEXT NOT NULL,
    "specialization" TEXT NOT NULL,
    "licenseNumber" TEXT NOT NULL,
    "hospitalName" TEXT NOT NULL,
    "department" TEXT NOT NULL,
    "status" TEXT NOT NULL DEFAULT 'ACTIVE',
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    CONSTRAINT "doctors_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);
INSERT INTO "new_doctors" ("createdAt", "department", "hospitalName", "id", "licenseNumber", "specialization", "updatedAt", "userId") SELECT "createdAt", "department", "hospitalName", "id", "licenseNumber", "specialization", "updatedAt", "userId" FROM "doctors";
DROP TABLE "doctors";
ALTER TABLE "new_doctors" RENAME TO "doctors";
CREATE UNIQUE INDEX "doctors_userId_key" ON "doctors"("userId");
CREATE UNIQUE INDEX "doctors_licenseNumber_key" ON "doctors"("licenseNumber");
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
