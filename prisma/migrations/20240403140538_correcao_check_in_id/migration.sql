-- RedefineTables
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_users" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "name" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "password" TEXT,
    "created_at" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "checkin_id" INTEGER,
    CONSTRAINT "users_checkin_id_fkey" FOREIGN KEY ("checkin_id") REFERENCES "check-ins" ("id") ON DELETE SET NULL ON UPDATE CASCADE
);
INSERT INTO "new_users" ("checkin_id", "created_at", "email", "id", "name", "password") SELECT "checkin_id", "created_at", "email", "id", "name", "password" FROM "users";
DROP TABLE "users";
ALTER TABLE "new_users" RENAME TO "users";
CREATE UNIQUE INDEX "users_email_key" ON "users"("email");
CREATE UNIQUE INDEX "users_checkin_id_key" ON "users"("checkin_id");
PRAGMA foreign_key_check;
PRAGMA foreign_keys=ON;
