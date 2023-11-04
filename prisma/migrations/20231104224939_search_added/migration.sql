-- CreateTable
CREATE TABLE "Search" (
    "id" SERIAL NOT NULL,
    "userId" INTEGER NOT NULL,
    "data" TEXT NOT NULL,

    CONSTRAINT "Search_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "Search" ADD CONSTRAINT "Search_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
