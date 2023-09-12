import { UseCase, UseCaseConstructor } from '../shared'
import { Post, Comment, User, PostMember } from '../entities'
import { CommentRepository } from '../repositories'

type Params = {
  commentRepository: CommentRepository
}

type Request = {
  user: User
  post: Post
  postMembers: PostMember[]
}

export type GetCommentsUsecase = UseCase<Request, Comment[]>

export const getCommentsUsecase: UseCaseConstructor<Params, Request, Comment[]> = (params) => {
  const { commentRepository } = params
  return async (request) => {
    const { post } = request

    const comments = await commentRepository.getByPostId(post.id)

    return comments
  }
}
