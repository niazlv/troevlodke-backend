-- AlterTable
ALTER TABLE "Cource" ADD COLUMN     "background_img" TEXT DEFAULT '',
ADD COLUMN     "mime_type_background_img" TEXT NOT NULL DEFAULT 'image/png';
