-- AlterTable
ALTER TABLE "Post" ADD COLUMN     "badge" TEXT[] DEFAULT ARRAY[]::TEXT[];
