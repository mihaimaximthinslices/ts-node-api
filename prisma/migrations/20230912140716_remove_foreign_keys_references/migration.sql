-- DropForeignKey
ALTER TABLE "Comment" DROP CONSTRAINT "Comment_postId_fkey";

-- DropForeignKey
ALTER TABLE "Comment" DROP CONSTRAINT "Comment_userId_fkey";

-- DropForeignKey
ALTER TABLE "Post" DROP CONSTRAINT "Post_userId_fkey";

-- DropForeignKey
ALTER TABLE "PostMember" DROP CONSTRAINT "PostMember_postId_fkey";

-- DropForeignKey
ALTER TABLE "PostMember" DROP CONSTRAINT "PostMember_userId_fkey";
