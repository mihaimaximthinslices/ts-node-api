import { Request, Response } from 'express'
import { GetPostUsecase } from '../../../domain/usecases'
import { RouteHandlerConstructor } from './types'
import { InvalidInputError } from '../../../domain/errors'

type Params = {
  usecase: GetPostUsecase
}

export const getPostMiddleware: RouteHandlerConstructor<Params> =
  (params: Params) => async (req: Request, _res: Response) => {
    const { postId } = req.params

    if (!postId) {
      throw new InvalidInputError('postId query param is required')
    }

    const { usecase } = params

    const post = await usecase({
      postId,
    })

    req.getPostMiddleware = {
      post,
    }
  }
