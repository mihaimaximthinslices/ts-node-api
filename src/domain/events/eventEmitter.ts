import { Post, Comment, User, PostMember } from '../entities'

export interface DomainEventEmitter {
  emitUserCreated(user: User): void
  emitPostCreated(user: User, post: Post): Promise<void>
  emitPostDeleted(user: User, post: Post, postMembers: PostMember[]): Promise<void>
  emitCommentCreated(comment: Comment): void
}
