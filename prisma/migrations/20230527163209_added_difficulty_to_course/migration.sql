-- AlterTable
ALTER TABLE "Cource" ADD COLUMN     "difficultylabel" TEXT DEFAULT 'Easy',
ADD COLUMN     "dificulty" INTEGER NOT NULL DEFAULT 0,
ADD COLUMN     "requirements" TEXT DEFAULT 'none';
