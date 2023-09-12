import { UseCase, UseCaseConstructor } from '../shared'
import { Post, PostComment, User, PostMember } from '../entities'
import { PostCommentRepository } from '../repositories'
import { DomainPermissionContext } from '../permissions/permissionContext'

type Params = {
  commentRepository: PostCommentRepository
}

type Request = {
  permissionContext: DomainPermissionContext
  user: User
  post: Post
  postMembers: PostMember[]
}

export type GetCommentsUsecase = UseCase<Request, PostComment[]>

export const getCommentsUsecase: UseCaseConstructor<Params, Request, PostComment[]> = (params) => {
  const { commentRepository } = params
  return async (request) => {
    const { post } = request

    const comments = await commentRepository.getByPostId(post.id)

    return comments
  }
}
