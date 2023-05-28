-- AlterTable
ALTER TABLE "users" ADD COLUMN     "catchphrases" TEXT[] DEFAULT ARRAY['key1', 'key2', 'key3']::TEXT[],
ADD COLUMN     "paircatchphrases" TEXT[] DEFAULT ARRAY[]::TEXT[];
