import { UseCase, UseCaseConstructor } from '../shared'
import { Post, PostMember, User } from '../entities'
import { permissionService } from '../permissions/permissionService'
import { DomainPermissionContext } from '../permissions/permissionContext'

type Params = void

type Request = {
  permissionContext: DomainPermissionContext
  user: User
  post: Post
  postMembers: PostMember[]
}

export type CheckPostMembershipUsecase = UseCase<Request, PostMember>

export const checkPostMembershipUsecase: UseCaseConstructor<Params, Request, PostMember> = (_params) => {
  return async (request) => {
    const { user, post, postMembers, permissionContext } = request

    permissionService.isPostMember(permissionContext, user, post, postMembers)

    const postMember = postMembers.find((member) => member.id === user.id)

    return postMember!
  }
}
