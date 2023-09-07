import { UseCase, UseCaseConstructor } from '../shared'
import { Post, User } from '../entities'
import { PostRepository } from '../repositories'

type Params = {
  postRepository: PostRepository
}

type Request = {
  user: User
}

export type GetPostsUsecase = UseCase<Request, Post[]>

export const getPostsUsecase: UseCaseConstructor<Params, Request, Post[]> = (params) => {
  const { postRepository } = params
  return async (request) => {
    const { user } = request

    const posts = await postRepository.getPostsByUserId(user.id)

    return posts
  }
}
