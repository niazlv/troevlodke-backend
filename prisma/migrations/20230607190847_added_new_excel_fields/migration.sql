-- CreateTable
CREATE TABLE "excelFieldsOfStudyNew" (
    "id" SERIAL NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "fileid" INTEGER NOT NULL,
    "ticketStatus" BOOLEAN NOT NULL DEFAULT false,
    "schoolid" INTEGER[] DEFAULT ARRAY[]::INTEGER[],
    "originalFileChecksum" TEXT NOT NULL,

    CONSTRAINT "excelFieldsOfStudyNew_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "SchoolNew" (
    "id" SERIAL NOT NULL,
    "idInFile" INTEGER DEFAULT 0,
    "name" TEXT DEFAULT '',
    "address" TEXT DEFAULT '',
    "phone" TEXT DEFAULT '',
    "email" TEXT DEFAULT '',
    "coordinates" TEXT DEFAULT '',
    "district" TEXT DEFAULT '',

    CONSTRAINT "SchoolNew_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "excelFieldsOfStudyNew_originalFileChecksum_key" ON "excelFieldsOfStudyNew"("originalFileChecksum");
