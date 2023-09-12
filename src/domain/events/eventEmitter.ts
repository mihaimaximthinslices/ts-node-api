import { Post, PostComment, User, PostMember } from '../entities'
import { DomainPermissionContext } from '../permissions/permissionContext'

export interface DomainEventEmitter {
  emitUserCreated(permissionContext: DomainPermissionContext, user: User): void
  emitPostCreated(permissionContext: DomainPermissionContext, user: User, post: Post): Promise<void>
  emitPostDeleted(
    permissionContext: DomainPermissionContext,
    user: User,
    post: Post,
    postMembers: PostMember[],
  ): Promise<void>
  emitCommentCreated(permissionContext: DomainPermissionContext, comment: PostComment): void
}
