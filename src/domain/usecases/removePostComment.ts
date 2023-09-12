import { UseCase, UseCaseConstructor } from '../shared'
import { Post, PostMember, User, PostComment } from '../entities'
import { PostCommentRepository } from '../repositories'
import { permissionService } from '../permissions/permissionService'
import { DomainPermissionContext } from '../permissions/permissionContext'

type Params = {
  postCommentRepository: PostCommentRepository
}

type Request = {
  permissionContext: DomainPermissionContext
  isDomainEvent: boolean
  user: User
  post: Post
  postMembers: PostMember[]
  comment: PostComment
}

export type RemovePostCommentUsecase = UseCase<Request, void>
export const removePostCommentUsecase: UseCaseConstructor<Params, Request, void> = (params) => {
  const { postCommentRepository } = params
  return async (request) => {
    const { user, comment, isDomainEvent, permissionContext } = request

    if (isDomainEvent) {
      await postCommentRepository.delete(comment.id)
      return
    }

    permissionService.canDeletePostComment(permissionContext, user, comment)

    await postCommentRepository.delete(comment.id)
  }
}
