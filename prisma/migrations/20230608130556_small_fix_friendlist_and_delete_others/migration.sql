/*
  Warnings:

  - You are about to drop the `FriendDeny` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `FriendRequest` table. If the table is not empty, all the data it contains will be lost.

*/
-- CreateEnum
CREATE TYPE "enumFriendRequest" AS ENUM ('REQUEST', 'ACCEPT', 'DENY');

-- AlterTable
ALTER TABLE "FriendList" ADD COLUMN     "status" "enumFriendRequest" NOT NULL DEFAULT 'REQUEST';

-- DropTable
DROP TABLE "FriendDeny";

-- DropTable
DROP TABLE "FriendRequest";
