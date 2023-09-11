import { UseCase, UseCaseConstructor } from '../shared'
import { Post } from '../entities'
import { PostRepository } from '../repositories'
import { EntityNotFound } from '../errors'

type Params = {
  postRepository: PostRepository
}

type Request = {
  postId: string
}

export type GetPostUsecase = UseCase<Request, Post>

export const getPostUsecase: UseCaseConstructor<Params, Request, Post> = (params) => {
  const { postRepository } = params
  return async (request) => {
    const { postId } = request

    const post = await postRepository.getById(postId)

    if (!post) {
      throw new EntityNotFound('Post', postId)
    }

    return post
  }
}
