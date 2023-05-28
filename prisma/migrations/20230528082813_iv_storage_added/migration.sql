/*
  Warnings:

  - Added the required column `secure_token_part_private` to the `ActiveToken` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "ActiveToken" ADD COLUMN     "secure_token_part_private" TEXT NOT NULL;

-- CreateTable
CREATE TABLE "Iv_storage" (
    "userid" INTEGER NOT NULL,
    "iv" TEXT NOT NULL,

    CONSTRAINT "Iv_storage_pkey" PRIMARY KEY ("userid")
);
