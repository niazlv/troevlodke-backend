-- CreateTable
CREATE TABLE "permissions" (
    "bit" INTEGER NOT NULL,
    "name" TEXT NOT NULL,

    CONSTRAINT "permissions_pkey" PRIMARY KEY ("bit")
);

-- CreateTable
CREATE TABLE "Role" (
    "bit" INTEGER NOT NULL,
    "name" TEXT NOT NULL,

    CONSTRAINT "Role_pkey" PRIMARY KEY ("bit")
);

-- CreateTable
CREATE TABLE "ActiveToken" (
    "id" SERIAL NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "userid" INTEGER NOT NULL,
    "token" TEXT NOT NULL,
    "description" TEXT NOT NULL DEFAULT 'CbAS',
    "permissions" BIGINT NOT NULL DEFAULT 1,
    "usedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "countOfUses" INTEGER NOT NULL DEFAULT 0,

    CONSTRAINT "ActiveToken_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "UserFeed" (
    "userid" INTEGER NOT NULL,
    "likesid" INTEGER[] DEFAULT ARRAY[]::INTEGER[],
    "comments" INTEGER[] DEFAULT ARRAY[]::INTEGER[],
    "posts" INTEGER[] DEFAULT ARRAY[]::INTEGER[],

    CONSTRAINT "UserFeed_pkey" PRIMARY KEY ("userid")
);

-- CreateTable
CREATE TABLE "users" (
    "id" SERIAL NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "role" INTEGER NOT NULL DEFAULT 3,
    "permissions" BIGINT NOT NULL DEFAULT 2,
    "other" JSONB NOT NULL DEFAULT '{}',
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "firstname" TEXT,
    "lastname" TEXT,
    "middlename" TEXT,
    "birthday" TIMESTAMP(3),
    "city" TEXT NOT NULL DEFAULT 'Moscow',
    "country" TEXT NOT NULL DEFAULT 'Russia',
    "login" TEXT NOT NULL,
    "hash" TEXT NOT NULL,
    "email" TEXT,
    "parentid" INTEGER[] DEFAULT ARRAY[0]::INTEGER[],
    "score" INTEGER NOT NULL DEFAULT 0,
    "courcesid" INTEGER[] DEFAULT ARRAY[]::INTEGER[],
    "progress" JSONB NOT NULL DEFAULT '{}',
    "friendsid" INTEGER[] DEFAULT ARRAY[]::INTEGER[],
    "interests" TEXT NOT NULL DEFAULT '',
    "tests" INTEGER[] DEFAULT ARRAY[]::INTEGER[],
    "rating" DOUBLE PRECISION NOT NULL DEFAULT 5,
    "social" JSONB NOT NULL DEFAULT '{}',
    "photo" TEXT,

    CONSTRAINT "users_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "ActiveToken_token_key" ON "ActiveToken"("token");

-- CreateIndex
CREATE UNIQUE INDEX "users_login_key" ON "users"("login");
