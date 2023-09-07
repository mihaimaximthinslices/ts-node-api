import { Request, Response } from 'express'
import { GetPostsUsecase } from '../../../domain/usecases'
import { sharedErrorHandler, withErrorHandling } from '../errorHandlers'
import { withMiddleware } from '../middlewares'
import { RouteHandlerConstructor } from '../middlewares'
import { useValidateUserMiddleware } from '../middlewares'

type Params = {
  usecase: GetPostsUsecase
}

export const getPostsHandler: RouteHandlerConstructor<Params> = withErrorHandling(
  withMiddleware([useValidateUserMiddleware], async (params: Params, req: Request, res: Response) => {
    const { usecase } = params

    const response = await usecase({
      user: req.validateUserMiddlewareResponse!.user,
    })

    return res.status(200).json(response)
  }),
  sharedErrorHandler,
)
