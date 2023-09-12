import { UseCase, UseCaseConstructor } from '../shared'
import { Comment, PostMember, User, Post } from '../entities'
import { CommentRepository } from '../repositories'
import { EntityNotFound } from '../errors'

type Params = {
  commentRepository: CommentRepository
}

type Request = {
  user: User
  post: Post
  postMembers: PostMember[]
  commentId: string
}

export type GetCommentUsecase = UseCase<Request, Comment>

export const getCommentUsecase: UseCaseConstructor<Params, Request, Comment> = (params) => {
  const { commentRepository } = params
  return async (request) => {
    const { commentId } = request

    const comment = await commentRepository.getById(commentId)

    if (!comment) {
      throw new EntityNotFound('Comment', commentId)
    }

    return comment
  }
}
