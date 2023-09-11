import { RepositoryFactory } from './RepositoryFactory'
import { CommentRepository, PostRepository, UserRepository } from '../../../../domain/repositories'
import { Post, User } from '../../../../domain/entities'
import { Comment } from '../../../../domain/entities'
import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()
const prismaPostRepository: PostRepository = {
  async getPostsByUserId(userId: string): Promise<Post[]> {
    const posts = await prisma.post.findMany({
      where: {
        userId,
      },
    })
    return posts
  },
  async getById(id: string): Promise<Post | null> {
    const post = await prisma.post.findFirst({
      where: {
        id,
      },
    })
    return post
  },

  async save(post: Post): Promise<void> {
    const { id, ...postData } = post

    // Use upsert to insert or update the post based on its ID
    await prisma.post.upsert({
      where: { id },
      update: postData,
      create: {
        id,
        ...postData,
      },
    })
  },

  async delete(post: Post): Promise<void> {
    const { id } = post
    await prisma.post.delete({
      where: { id },
    })
  },
}

const prismaUserRepository: UserRepository = {
  async getByEmail(email: string): Promise<User | null> {
    const user = await prisma.user.findFirst({
      where: { email },
    })
    return user
  },

  async save(user: User): Promise<void> {
    const { id, ...userData } = user

    // Use upsert to insert or update the user based on their ID
    await prisma.user.upsert({
      where: { id },
      update: userData,
      create: {
        id,
        ...userData,
      },
    })
  },

  async delete(user: User): Promise<void> {
    const { id } = user
    await prisma.user.delete({
      where: { id },
    })
  },
}

const prismaCommentRepository: CommentRepository = {
  async getById(id: string): Promise<Comment | null> {
    const comment = await prisma.comment.findUnique({
      where: { id },
    })
    return comment ?? null
  },

  async getByPostId(postId: string): Promise<Comment[]> {
    const comments = await prisma.comment.findMany({
      where: { postId },
    })
    return comments
  },

  async save(comment: Comment): Promise<void> {
    const { id, ...commentData } = comment

    await prisma.comment.upsert({
      where: { id },
      update: commentData,
      create: {
        id,
        ...commentData,
      },
    })
  },

  async delete(id: string): Promise<void> {
    await prisma.comment.delete({
      where: { id },
    })
  },
}

export const makePrismaRepositoryFactory = (): RepositoryFactory => {
  return {
    makeUserRepository: () => prismaUserRepository,
    makePostRepository: () => prismaPostRepository,
    makeCommentRepository: () => prismaCommentRepository,
  }
}
