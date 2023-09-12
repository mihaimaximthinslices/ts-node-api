import { UseCase, UseCaseConstructor } from '../shared'
import { Post, PostMember, User } from '../entities'
import { PostRepository } from '../repositories'
import { permissionService } from '../permissions/permissionService'
import { DomainEventEmitter } from '../events'
import { DomainPermissionContext } from '../permissions/permissionContext'

type Params = {
  postRepository: PostRepository
  domainEventEmitter: DomainEventEmitter
}

type Request = {
  permissionContext: DomainPermissionContext
  user: User
  post: Post
  postMembers: PostMember[]
}

export type RemovePostUsecase = UseCase<Request, void>

export const removePostUsecase: UseCaseConstructor<Params, Request, void> = (params) => {
  const { postRepository, domainEventEmitter } = params
  return async (request) => {
    const { user, post, postMembers, permissionContext } = request

    permissionService.isPostOwner(permissionContext, user, post, postMembers)

    await postRepository.delete(post)

    await domainEventEmitter.emitPostDeleted(permissionContext, user, post, postMembers)
  }
}
