-- AlterTable
ALTER TABLE "Post" ADD COLUMN     "clubid" INTEGER NOT NULL DEFAULT 0;

-- AlterTable
ALTER TABLE "Stage" ADD COLUMN     "quizzesid" INTEGER;

-- AlterTable
ALTER TABLE "users" ADD COLUMN     "clubid" INTEGER[] DEFAULT ARRAY[0]::INTEGER[];

-- CreateTable
CREATE TABLE "club" (
    "id" SERIAL NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "title" TEXT NOT NULL,
    "subscribersCount" INTEGER NOT NULL DEFAULT 0,

    CONSTRAINT "club_pkey" PRIMARY KEY ("id")
);
