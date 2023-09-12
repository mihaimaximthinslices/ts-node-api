import { Request, Response } from 'express'
import { RouteHandlerConstructor } from './types'
import { GetPostMembersUsecase } from '../../../domain/usecases/getPostMembers'

type Params = {
  usecase: GetPostMembersUsecase
}

export const getPostMembersMiddleware: RouteHandlerConstructor<Params> =
  (params: Params) => async (req: Request, _res: Response) => {
    const { usecase } = params

    const postMembers = await usecase({
      user: req.validateUserMiddlewareResponse!.user,
      post: req.getPostMiddlewareResponse!.post,
    })

    req.getPostMembersMiddlewareResponse = {
      postMembers,
    }
  }
