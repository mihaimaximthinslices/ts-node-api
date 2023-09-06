import { UseCase, UseCaseConstructor } from '../shared'
import { Post } from '../entities'
import { PostRepository, UserRepository } from '../repositories'

type Params = {
  userRepository: UserRepository
  postRepository: PostRepository
}

type Request = {
  email: string
}

export type GetPostsUsecase = UseCase<Request, Post[]>

export const getPostsUsecase: UseCaseConstructor<Params, Request, Post[]> = (params) => {
  const { userRepository, postRepository } = params
  return async (request) => {
    const { email } = request

    const user = await userRepository.getByEmail(email)

    if (!user) {
      throw new Error('User not found')
    }

    const posts = postRepository.getPostsByUserId(user.id)

    return posts
  }
}
