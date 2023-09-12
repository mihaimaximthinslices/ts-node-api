-- CreateEnum
CREATE TYPE "Role" AS ENUM ('OWNER', 'GUEST');

-- CreateTable
CREATE TABLE "PostMember" (
    "id" TEXT NOT NULL,
    "postId" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "role" "Role" NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "PostMember_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "PostMember" ADD CONSTRAINT "PostMember_postId_fkey" FOREIGN KEY ("postId") REFERENCES "Post"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PostMember" ADD CONSTRAINT "PostMember_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
