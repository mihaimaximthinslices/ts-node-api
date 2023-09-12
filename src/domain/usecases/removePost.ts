import { UseCase, UseCaseConstructor } from '../shared'
import { Post, PostMember, User } from '../entities'
import { PostRepository } from '../repositories'
import { permissionService } from '../permissions/permissionService'
import { DomainEventEmitter } from '../events'

type Params = {
  postRepository: PostRepository
  domainEventEmitter: DomainEventEmitter
}

type Request = {
  user: User
  post: Post
  postMembers: PostMember[]
}

export type RemovePostUsecase = UseCase<Request, void>

export const removePostUsecase: UseCaseConstructor<Params, Request, void> = (params) => {
  const { postRepository, domainEventEmitter } = params
  return async (request) => {
    const { user, post, postMembers } = request

    permissionService.isPostOwner(user, post, postMembers)

    await postRepository.delete(post)

    await domainEventEmitter.emitPostDeleted(user, post, postMembers)
  }
}
