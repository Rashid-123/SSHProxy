/*
  Warnings:

  - Added the required column `authTagPassphrase` to the `Machine` table without a default value. This is not possible if the table is not empty.
  - Added the required column `authTagPrivateKey` to the `Machine` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Machine" ADD COLUMN     "authTagPassphrase" TEXT NOT NULL,
ADD COLUMN     "authTagPrivateKey" TEXT NOT NULL;
