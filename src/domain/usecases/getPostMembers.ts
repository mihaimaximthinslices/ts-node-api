import { UseCase, UseCaseConstructor } from '../shared'
import { Post, PostMember, User } from '../entities'

import { PostMemberRepository } from '../repositories/PostMemberRepository'

type Params = {
  postMemberRepository: PostMemberRepository
}

type Request = {
  user: User
  post: Post
}

export type GetPostMembersUsecase = UseCase<Request, PostMember[]>

export const getPostMembers: UseCaseConstructor<Params, Request, PostMember[]> = (params) => {
  const { postMemberRepository } = params
  return async (request) => {
    const { post } = request

    return await postMemberRepository.getByPostId(post.id)
  }
}
