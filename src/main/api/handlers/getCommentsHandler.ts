import { Request, Response } from 'express'
import { RouteHandlerConstructor } from '../middlewares'
import { GetCommentsUsecase } from '../../../domain/usecases'

type Params = {
  usecase: GetCommentsUsecase
}

export const getCommentsHandler: RouteHandlerConstructor<Params> =
  (params: Params) => async (req: Request, res: Response) => {
    const { usecase } = params

    const response = await usecase({
      user: req.validateUserMiddlewareResponse!.user,
      post: req.getPostMiddlewareResponse!.post,
      postMembers: req.getPostMembersMiddlewareResponse!.postMembers,
    })

    return res.status(200).json(response)
  }
