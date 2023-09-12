import { Post, PostMember, User, PostComment } from '../entities'
import { DuplicateEntityError, InvalidInputError, UnauthorizedError } from '../errors'
import { DomainPermissionContext } from './permissionContext'
export type DomainPermission = 'isPostOwner' | 'isPostMember' | 'canViewPostComment'
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
  verifyAndGetPostMember: (
    permissionContext: DomainPermissionContext,
    user: User,
    post: Post,
    postMembers: PostMember[],
  ) => PostMember
  canModifyPost: (permissionContext: DomainPermissionContext, user: User, post: Post, postMembers: PostMember[]) => void
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
  arePostMembers(post: Post, postMembers: PostMember[]): void {
    const notMember = postMembers.find((member) => member.postId !== post.id)

    if (notMember) {
      throw new InvalidInputError('Not all postMembers are members of the Post')
    }
  }

  verifyAndGetPostMember(
    _permissionContext: DomainPermissionContext,
    user: User,
    post: Post,
    postMembers: PostMember[],
  ): PostMember {
    this.arePostMembers(post, postMembers)

    const member = postMembers.find((member) => member.userId === user.id)
    if (!member) {
      throw new UnauthorizedError('User')
    }

    return member
  }

  canDeletePostComment(_permissionContext: DomainPermissionContext, user: User, postComment: PostComment): void {
    if (user.id !== postComment.userId) {
      throw new UnauthorizedError('User')
    }
  }

  canViewPostComment(
    permissionContext: DomainPermissionContext,
    user: User,
    post: Post,
    postMembers: PostMember[],
    postComment: PostComment,
  ): void {
    this.isPostMember(permissionContext, user, post, postMembers)
    if (!permissionContext.hasPermission('canViewPostComment')) {
      if (postComment.postId !== post.id) {
        throw new InvalidInputError('Comment does not belong to the post')
      }
      permissionContext.grantPermission('canViewPostComment')
    }
  }

  canDeletePostMember(
    _permissionContext: DomainPermissionContext,
    user: User,
    post: Post,
    postMembers: PostMember[],
    postMemberToDelete: PostMember,
  ): void {
    this.isPostOwner(_permissionContext, user, post, postMembers)
    if (postMemberToDelete.role === 'OWNER') {
      throw new InvalidInputError('You cannot remove the owner of the post')
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

  isPostOwner(_permissionContext: DomainPermissionContext, user: User, post: Post, postMembers: PostMember[]): void {
    const userId = user.id

    if (postMembers.length > 0) {
      this.arePostMembers(post, postMembers)
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
  }

  canModifyPost(_permissionContext: DomainPermissionContext, user: User, post: Post, postMembers: PostMember[]) {
    this.isPostOwner(_permissionContext, user, post, postMembers)
  }

  canAddPostMember(
    _permissionContext: DomainPermissionContext,
    user: User,
    post: Post,
    postMembers: PostMember[],
    newPostMember: PostMember,
    newPostMemberUser: User,
  ): void {
    this.isPostOwner(_permissionContext, user, post, postMembers)
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
  }
}

export const permissionService = new PermissionService()
