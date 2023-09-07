import { RequestHandler } from 'express'
import { User } from '../../../domain/entities'

declare global {
  namespace Express {
    interface Request {
      validateUserMiddlewareResponse?: {
        user: User
      }
    }
  }
}

export type RouteHandlerConstructor<T> = (params: T) => RequestHandler
