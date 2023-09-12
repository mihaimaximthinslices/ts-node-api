import { RequestHandler } from 'express'
import { Post, User, Comment, PostMember } from '../../../domain/entities'

declare global {
  namespace Express {
    interface Request {
      validateUserMiddlewareResponse?: {
        user: User
      }
      getPostMiddlewareResponse?: {
        post: Post
      }
      getCommentMiddleware?: {
        comment: Comment
      }
      getPostMembersMiddlewareResponse?: {
        postMembers: PostMember[]
      }
    }
  }
}

export type RouteHandlerConstructor<T> = (params: T) => RequestHandler
