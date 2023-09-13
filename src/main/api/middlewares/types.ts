import { RequestHandler } from 'express'
import { Post, User, PostComment, PostMember } from '../../../domain/entities'
import { DomainPermissionContext } from '../../../domain/permissions/permissionContext'

declare global {
  namespace Express {
    interface Request {
      permissionContext: DomainPermissionContext
      validateUserMiddlewareResponse?: {
        user: User
      }
      getPostMiddlewareResponse?: {
        post: Post
      }
      getPostCommentMiddlewareResponse?: {
        comment: PostComment
      }
      getPostMembersMiddlewareResponse?: {
        postMembers: PostMember[]
      }
    }
  }
}

export type RouteHandlerConstructor<T> = (params: T) => RequestHandler
