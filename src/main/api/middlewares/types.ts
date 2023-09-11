import { RequestHandler } from 'express'
import { Post, User } from '../../../domain/entities'

declare global {
  namespace Express {
    interface Request {
      validateUserMiddlewareResponse?: {
        user: User
      }
      getPostMiddleware?: {
        post: Post
      }
    }
  }
}

export type RouteHandlerConstructor<T> = (params: T) => RequestHandler
