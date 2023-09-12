import { UseCase, UseCaseConstructor } from '../shared'
import { PostComment, PostMember, User, Post } from '../entities'
import { PostCommentRepository } from '../repositories'
import { EntityNotFound } from '../errors'
import { permissionService } from '../permissions/permissionService'
import { DomainPermissionContext } from '../permissions/permissionContext'

type Params = {
  postCommentRepository: PostCommentRepository
}

type Request = {
  permissionContext: DomainPermissionContext
  user: User
  post: Post
  postMembers: PostMember[]
  commentId: string
}

export type GetCommentUsecase = UseCase<Request, PostComment>

export const getPostCommentUsecase: UseCaseConstructor<Params, Request, PostComment> = (params) => {
  const { postCommentRepository } = params
  return async (request) => {
    const { commentId, permissionContext, postMembers, post, user } = request

    const comment = await postCommentRepository.getById(commentId)

    if (!comment) {
      throw new EntityNotFound('Comment', commentId)
    }

    permissionService.canViewPostComment(permissionContext, user, post, postMembers, comment)

    return comment
  }
}
