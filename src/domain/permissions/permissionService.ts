import { Post, PostMember, User, PostComment } from '../entities'
import { DuplicateEntityError, InvalidInputError, UnauthorizedError } from '../errors'
import { DomainPermissionContext } from './permissionContext'
export type DomainPermission =
  | 'isPostOwner'
  | 'isPostMember'
  | 'canViewPostComment'
  | 'canAddPostMember'
  | 'canDeletePostMember'
  | 'arePostMembers'
export interface DomainPermissionService {
  isPostOwner: (permissionContext: DomainPermissionContext, user: User, post: Post, postMembers: PostMember[]) => void
  canAddPostMember: (
    permissionContext: DomainPermissionContext,
    user: User,
    post: Post,
    postMembers: PostMember[],
    newPostMember: PostMember,
    newPostMemberUser: User,
  ) => void
  isPostMember: (permissionContext: DomainPermissionContext, user: User, post: Post, postMembers: PostMember[]) => void
  canDeletePostComment: (permissionContext: DomainPermissionContext, user: User, postComment: PostComment) => void
  canDeletePostMember: (
    permissionContext: DomainPermissionContext,
    user: User,
    post: Post,
    postMembers: PostMember[],
    postMemberToDelete: PostMember,
  ) => void
  canViewPostComment: (
    permissionContext: DomainPermissionContext,
    user: User,
    post: Post,
    postMembers: PostMember[],
    postComment: PostComment,
  ) => void
}

class PermissionService implements DomainPermissionService {
  arePostMembers(permissionContext: DomainPermissionContext, post: Post, postMembers: PostMember[]): void {
    if (!permissionContext.hasPermission('arePostMembers')) {
      const notMember = postMembers.find((member) => member.postId !== post.id)

      if (notMember) {
        throw new InvalidInputError('Not all postMembers are members of the Post')
      }
      permissionContext.grantPermission('arePostMembers')
    }
  }
  canDeletePostComment(permissionContext: DomainPermissionContext, user: User, postComment: PostComment): void {
    if (!permissionContext.hasPermission('canViewPostComment')) {
      if (user.id !== postComment.userId) {
        throw new UnauthorizedError('User')
      }
      permissionContext.grantPermission('canViewPostComment')
    }
  }

  canViewPostComment(
    permissionContext: DomainPermissionContext,
    user: User,
    post: Post,
    postMembers: PostMember[],
    postComment: PostComment,
  ): void {
    if (!permissionContext.hasPermission('canViewPostComment')) {
      this.isPostMember(permissionContext, user, post, postMembers)

      if (postComment.postId !== post.id) {
        throw new InvalidInputError('Comment does not belong to the post')
      }
      permissionContext.grantPermission('canViewPostComment')
    }
  }

  canDeletePostMember(
    permissionContext: DomainPermissionContext,
    user: User,
    post: Post,
    postMembers: PostMember[],
    postMemberToDelete: PostMember,
  ): void {
    if (!permissionContext.hasPermission('canDeletePostMember')) {
      this.isPostOwner(permissionContext, user, post, postMembers)
      if (postMemberToDelete.role === 'OWNER') {
        throw new InvalidInputError('You cannot remove the owner of the post')
      }
      permissionContext.grantPermission('canDeletePostMember')
    }
  }

  isPostMember(permissionContext: DomainPermissionContext, user: User, post: Post, postMembers: PostMember[]): void {
    if (!permissionContext.hasPermission('isPostMember')) {
      const userId = user.id

      const userMember = postMembers.find((member) => member.userId === userId)

      if (!userMember) {
        throw new UnauthorizedError('User')
      }

      const belongsToPost = userMember.postId === post.id

      if (!belongsToPost) {
        throw new UnauthorizedError('User')
      }
      permissionContext.grantPermission('isPostMember')
    }
  }

  isPostOwner(permissionContext: DomainPermissionContext, user: User, post: Post, postMembers: PostMember[]): void {
    if (!permissionContext.hasPermission('isPostOwner')) {
      const userId = user.id

      if (postMembers.length > 0) {
        this.arePostMembers(permissionContext, post, postMembers)
      }

      const userMember = postMembers.find((post) => post.userId === userId)

      if (postMembers.length > 0) {
        if (!userMember) {
          throw new UnauthorizedError('User')
        }
        if (userMember.role !== 'OWNER') {
          throw new UnauthorizedError('User')
        }
      }

      if (user.id !== post.userId) {
        throw new UnauthorizedError('User')
      }
      permissionContext.grantPermission('isPostOwner')
    }
  }

  canAddPostMember(
    permissionContext: DomainPermissionContext,
    user: User,
    post: Post,
    postMembers: PostMember[],
    newPostMember: PostMember,
    newPostMemberUser: User,
  ): void {
    if (!permissionContext.hasPermission('canAddPostMember')) {
      this.isPostOwner(permissionContext, user, post, postMembers)

      if (newPostMember.role === 'OWNER' && postMembers.length > 0) {
        throw new UnauthorizedError('User')
      }
      if (newPostMemberUser.id !== newPostMemberUser.id) {
        throw new InvalidInputError('Post member does not link to any user')
      }

      const memberAlreadyExists = postMembers.find((member) => member.userId === user.id)

      if (memberAlreadyExists) {
        throw new DuplicateEntityError('Member was already invited to the post')
      }
      permissionContext.grantPermission('canAddPostMember')
    }
  }
}

export const permissionService = new PermissionService()
