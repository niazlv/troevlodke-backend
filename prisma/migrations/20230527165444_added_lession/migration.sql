-- AlterTable
ALTER TABLE "Cource" ADD COLUMN     "mime_type_icons" TEXT NOT NULL DEFAULT 'image/svg+xml';

-- AlterTable
ALTER TABLE "Stage" ADD COLUMN     "coverimage" TEXT,
ADD COLUMN     "mime_type_coverimage" TEXT DEFAULT 'image/png';

-- CreateTable
CREATE TABLE "Lession" (
    "id" SERIAL NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "mimetype" TEXT,
    "url" TEXT,
    "text" TEXT,

    CONSTRAINT "Lession_pkey" PRIMARY KEY ("id")
);
