import { Post, Comment, User } from '../entities'

export interface DomainEventEmitter {
  onUserCreated(listener: (user: User) => void): void
  onPostCreated(listener: (post: Post) => void): void
  onPostDeleted(listener: (post: Post) => void): void
  onCommentCreated(listener: (comment: Comment) => void): void

  emitUserCreated(user: User): void
  emitPostCreated(post: Post): void
  emitPostDeleted(post: Post): void
  emitCommentCreated(comment: Comment): void
}
