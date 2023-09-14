import { GetPostsUsecase } from '../../../domain/usecases'
import { RouteHandlerConstructor } from '../middlewares'
import { IRequest } from '../../../domain/handlers/request'
import { IResponse } from '../../../domain/handlers/response'

type Params = {
  usecase: GetPostsUsecase
}
export const getPostsHandlerMiddlewares = ['addPermissionContextMiddleware', 'validateUserMiddleware']
export const getPostsHandler: RouteHandlerConstructor<Params> =
  (params: Params) => async (req: IRequest, res: IResponse) => {
    const { usecase } = params

    const { validateUserMiddlewareResponse } = req.getRequestContextStore()

    const response = await usecase({
      user: validateUserMiddlewareResponse!.user,
    })

    return res.sendJsonResponse(200, response)
  }
