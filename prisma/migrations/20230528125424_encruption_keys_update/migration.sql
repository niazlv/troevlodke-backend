-- CreateTable
CREATE TABLE "Keys" (
    "userid" INTEGER NOT NULL,
    "key" TEXT NOT NULL,
    "isHidden" BOOLEAN NOT NULL DEFAULT true,

    CONSTRAINT "Keys_pkey" PRIMARY KEY ("userid")
);
