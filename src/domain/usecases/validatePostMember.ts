import { UseCase, UseCaseConstructor } from '../shared'
import { Post, PostMember, User } from '../entities'
import { permissionService } from '../permissions/permissionService'

type Params = void

type Request = {
  user: User
  post: Post
  postMembers: PostMember[]
}

export type ValidatePostMemberUsecase = UseCase<Request, void>

export const validatePostMemberUsecase: UseCaseConstructor<Params, Request, void> = (_params) => {
  return async (request) => {
    const { user, post, postMembers } = request

    permissionService.isPostMember(user, post, postMembers)
  }
}
