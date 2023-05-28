-- AlterTable
CREATE SEQUENCE iv_storage_userid_seq;
ALTER TABLE "Iv_storage" ALTER COLUMN "userid" SET DEFAULT nextval('iv_storage_userid_seq'),
ALTER COLUMN "iv" SET DEFAULT '';
ALTER SEQUENCE iv_storage_userid_seq OWNED BY "Iv_storage"."userid";
