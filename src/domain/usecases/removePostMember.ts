import { UseCase, UseCaseConstructor } from '../shared'
import { Post, PostMember, User } from '../entities'
import { permissionService } from '../permissions/permissionService'
import { PostMemberRepository } from '../repositories/PostMemberRepository'
import { DomainPermissionContext } from '../permissions/permissionContext'

type Params = {
  postMemberRepository: PostMemberRepository
}

type Request = {
  permissionContext: DomainPermissionContext
  isDomainEvent: boolean
  user: User
  post: Post
  postMembers: PostMember[]
  postMemberToDelete: PostMember
}

export type RemovePostMemberUsecase = UseCase<Request, void>
export const removePostMemberUsecase: UseCaseConstructor<Params, Request, void> = (params) => {
  const { postMemberRepository } = params
  return async (request) => {
    const { user, post, isDomainEvent, postMembers, postMemberToDelete, permissionContext } = request

    if (isDomainEvent) {
      await postMemberRepository.delete(postMemberToDelete.id)
      return
    }

    permissionService.canDeletePostMember(permissionContext, user, post, postMembers, postMemberToDelete)

    await postMemberRepository.delete(postMemberToDelete.id)
  }
}
