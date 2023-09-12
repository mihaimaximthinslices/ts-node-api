import { UseCase, UseCaseConstructor, UuidGenerator, DateGenerator } from '../shared'
import { User } from '../entities'
import { PostCommentRepository } from '../repositories'
import { DomainEventEmitter } from '../events'
import { Post, PostComment } from '../entities'
import { DomainPermissionContext } from '../permissions/permissionContext'

type Params = {
  uuidGenerator: UuidGenerator
  dateGenerator: DateGenerator
  postCommentRepository: PostCommentRepository
  domainEventEmitter: DomainEventEmitter
}

type Request = {
  permissionContext: DomainPermissionContext
  user: User
  post: Post
  text: string
}

export type CreateCommentUsecase = UseCase<Request, PostComment>
export const createCommentUsecase: UseCaseConstructor<Params, Request, PostComment> = (params) => {
  const { uuidGenerator, dateGenerator, domainEventEmitter, postCommentRepository } = params
  return async (request) => {
    const { user, post, text, permissionContext } = request

    const id = uuidGenerator.next()
    const NOW = dateGenerator.now()

    const comment: PostComment = {
      id,
      postId: post.id,
      userId: user.id,
      text,
      createdAt: NOW,
      updatedAt: NOW,
    }

    await postCommentRepository.save(comment)

    domainEventEmitter.emitCommentCreated(permissionContext, comment)

    return comment
  }
}
