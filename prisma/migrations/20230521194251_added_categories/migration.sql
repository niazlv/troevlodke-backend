-- AlterTable
ALTER TABLE "users" ADD COLUMN     "categories" JSONB DEFAULT '{}';

-- CreateTable
CREATE TABLE "Files" (
    "id" SERIAL NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "filename" TEXT NOT NULL,
    "mimetype" TEXT,
    "encoding" TEXT NOT NULL,
    "data" BYTEA NOT NULL,
    "size" INTEGER NOT NULL,
    "checksum" TEXT NOT NULL,

    CONSTRAINT "Files_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "School" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "chunks" JSONB NOT NULL,
    "years" TEXT[],

    CONSTRAINT "School_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "excelFieldsOfStudy" (
    "id" SERIAL NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "fileid" INTEGER NOT NULL,
    "ticketStatus" BOOLEAN NOT NULL DEFAULT false,
    "nameChunks" TEXT[] DEFAULT ARRAY[]::TEXT[],
    "nameYear" TEXT NOT NULL DEFAULT '',
    "schoolid" INTEGER[] DEFAULT ARRAY[]::INTEGER[],
    "originalFileChecksum" TEXT NOT NULL,

    CONSTRAINT "excelFieldsOfStudy_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Quizzes" (
    "id" SERIAL NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "type" INTEGER NOT NULL DEFAULT 0,
    "data" TEXT NOT NULL,
    "description" TEXT,
    "title" TEXT,

    CONSTRAINT "Quizzes_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Files_checksum_key" ON "Files"("checksum");

-- CreateIndex
CREATE UNIQUE INDEX "excelFieldsOfStudy_originalFileChecksum_key" ON "excelFieldsOfStudy"("originalFileChecksum");
