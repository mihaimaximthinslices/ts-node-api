import { Post, PostComment, PostMember, User } from '../entities'
import { IResponse } from './response'
import { DomainPermissionContext } from '../permissions/permissionContext'

export interface ParamsDictionary {
  [key: string]: string
}

export type ISessionData = {
  user?: User
}

export type IRequestContextStore = {
  permissionContext?: DomainPermissionContext
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
  checkPostMembershipMiddlewareResponse?: {
    postMember: PostMember
  }
}

/* eslint-disable  @typescript-eslint/no-explicit-any */

export interface IRequest {
  getPathParams: () => ParamsDictionary
  getQueryParams: () => ParamsDictionary
  /* eslint-disable  @typescript-eslint/no-explicit-any */
  getBody: () => any
  setSessionData: (sessionData: ISessionData) => void
  getSessionData: () => ISessionData
  destroySession: (returnCallback: (res: IResponse) => void) => void
  getRequestContextStore: () => IRequestContextStore
  setRequestContextStore: (requestContextStore: IRequestContextStore) => void
}
