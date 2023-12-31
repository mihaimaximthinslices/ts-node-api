import { UseCase, UseCaseConstructor, UuidGenerator, DateGenerator } from '../shared'
import { User } from '../entities'
import { PostRepository } from '../repositories'
import { DomainEventEmitter } from '../events'
import { Post } from '../entities'
import { DomainPermissionContext } from '../permissions/permissionContext'

type Params = {
  uuidGenerator: UuidGenerator
  dateGenerator: DateGenerator
  postRepository: PostRepository
  domainEventEmitter: DomainEventEmitter
}

type Request = {
  permissionContext: DomainPermissionContext
  user: User
  title: string
  description: string
}

export type CreatePostUsecase = UseCase<Request, Post>
export const createPostUsecase: UseCaseConstructor<Params, Request, Post> = (params) => {
  const { uuidGenerator, dateGenerator, domainEventEmitter, postRepository } = params
  return async (request) => {
    const { title, description, user, permissionContext } = request

    const id = uuidGenerator.next()
    const NOW = dateGenerator.now()

    const post: Post = {
      id,
      title,
      description,
      userId: user.id,
      createdAt: NOW,
      updatedAt: NOW,
    }

    await postRepository.save(post)

    await domainEventEmitter.emitPostCreated(permissionContext, user, post)

    return post
  }
}
