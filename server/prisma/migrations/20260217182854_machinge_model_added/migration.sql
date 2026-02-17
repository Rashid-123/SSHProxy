-- DropIndex
DROP INDEX "User_clerkId_idx";

-- CreateTable
CREATE TABLE "Machine" (
    "id" TEXT NOT NULL,
    "name" VARCHAR(100) NOT NULL,
    "hostname" VARCHAR(255) NOT NULL,
    "port" INTEGER NOT NULL DEFAULT 22,
    "username" VARCHAR(100) NOT NULL,
    "encryptedPrivateKey" TEXT NOT NULL,
    "ivPrivateKey" TEXT NOT NULL,
    "encryptedPassphrase" TEXT NOT NULL,
    "ivPassphrase" TEXT NOT NULL,
    "ownerId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Machine_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "Machine_ownerId_idx" ON "Machine"("ownerId");

-- CreateIndex
CREATE UNIQUE INDEX "Machine_ownerId_name_key" ON "Machine"("ownerId", "name");

-- CreateIndex
CREATE INDEX "User_id_idx" ON "User"("id");

-- AddForeignKey
ALTER TABLE "Machine" ADD CONSTRAINT "Machine_ownerId_fkey" FOREIGN KEY ("ownerId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;
