import { Request, Response } from 'express'
import { GetPostsUsecase } from '../../../domain/usecases'
import { RouteHandlerConstructor } from '../middlewares'

type Params = {
  usecase: GetPostsUsecase
}
export const getPostsHandlerMiddlewares = ['addPermissionContextMiddleware', 'validateUserMiddleware']
export const getPostsHandler: RouteHandlerConstructor<Params> =
  (params: Params) => async (req: Request, res: Response) => {
    const { usecase } = params

    const response = await usecase({
      user: req.validateUserMiddlewareResponse!.user,
    })

    return res.status(200).json(response)
  }
