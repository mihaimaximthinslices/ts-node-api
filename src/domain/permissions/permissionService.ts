import { Post, PostMember, User } from '../entities'
import { DuplicateEntityError, InvalidInputError, UnauthorizedError } from '../errors'

export interface DomainPermissionService {
  isPostOwner: (user: User, post: Post, postMembers: PostMember[]) => void
  canAddPostMember: (
    user: User,
    post: Post,
    postMembers: PostMember[],
    newPostMember: PostMember,
    newPostMemberUser: User,
  ) => void
  verifyAndGetPostMember: (user: User, post: Post, postMembers: PostMember[]) => PostMember
  canModifyPost: (user: User, post: Post, postMembers: PostMember[]) => void
  isPostMember: (user: User, post: Post, postMembers: PostMember[]) => void
}

class PermissionService implements DomainPermissionService {
  arePostMembers(post: Post, postMembers: PostMember[]): void {
    const notMember = postMembers.find((member) => member.postId !== post.id)

    if (notMember) {
      throw new InvalidInputError('Not all postMembers are members of the Post')
    }
  }

  verifyAndGetPostMember(user: User, post: Post, postMembers: PostMember[]): PostMember {
    this.arePostMembers(post, postMembers)

    const member = postMembers.find((member) => member.userId === user.id)
    if (!member) {
      throw new UnauthorizedError('User', 'access post')
    }

    return member
  }

  isPostMember(user: User, post: Post, postMembers: PostMember[]): void {
    const userId = user.id

    const userMember = postMembers.find((member) => member.userId === userId)

    if (!userMember) {
      throw new UnauthorizedError('User is not a member of the post')
    }

    const belongsToPost = userMember.postId === post.id

    if (!belongsToPost) {
      throw new UnauthorizedError('User does not belong to this post')
    }
  }
  isPostOwner(user: User, post: Post, postMembers: PostMember[]): void {
    const userId = user.id

    if (postMembers.length > 0) {
      this.arePostMembers(post, postMembers)
    }

    const userMember = postMembers.find((post) => post.userId === userId)

    if (postMembers.length > 0) {
      if (!userMember) {
        throw new UnauthorizedError('User is not a member of the post')
      }
      if (userMember.role !== 'OWNER') {
        throw new UnauthorizedError('User is not the owner of the post')
      }
    }

    if (user.id !== post.userId) {
      throw new UnauthorizedError('User is not the owner of the post')
    }
  }

  canModifyPost(user: User, post: Post, postMembers: PostMember[]) {
    this.isPostOwner(user, post, postMembers)
  }

  canAddPostMember(
    user: User,
    post: Post,
    postMembers: PostMember[],
    newPostMember: PostMember,
    newPostMemberUser: User,
  ): void {
    this.isPostOwner(user, post, postMembers)
    if (newPostMember.role === 'OWNER' && postMembers.length > 0) {
      throw new UnauthorizedError('Posts can only have one owner')
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
