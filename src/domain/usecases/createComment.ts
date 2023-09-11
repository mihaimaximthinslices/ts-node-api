import { UseCase, UseCaseConstructor, UuidGenerator, DateGenerator } from '../shared'
import { User } from '../entities'
import { CommentRepository } from '../repositories'
import { DomainEventEmitter } from '../events'
import { Post, Comment } from '../entities'

type Params = {
  uuidGenerator: UuidGenerator
  dateGenerator: DateGenerator
  commentRepository: CommentRepository
  domainEventEmitter: DomainEventEmitter
}

type Request = {
  user: User
  post: Post
  text: string
}

export type CreateCommentUsecase = UseCase<Request, Comment>
export const createCommentUsecase: UseCaseConstructor<Params, Request, Comment> = (params) => {
  const { uuidGenerator, dateGenerator, domainEventEmitter, commentRepository } = params
  return async (request) => {
    const { user, post, text } = request

    const id = uuidGenerator.next()
    const NOW = dateGenerator.now()

    const comment: Comment = {
      id,
      postId: post.id,
      userId: user.id,
      text,
      createdAt: NOW,
      updatedAt: NOW,
    }

    await commentRepository.save(comment)

    domainEventEmitter.emitCommentCreated(comment)

    return comment
  }
}
