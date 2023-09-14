import { RouteHandlerConstructor } from '../middlewares'
import { createPostSchema } from '../../shared/validationSchemas'
import { CreatePostUsecase } from '../../../domain/usecases'
import { IRequest } from '../../../domain/handlers/request'
import { IResponse } from '../../../domain/handlers/response'

type Params = {
  usecase: CreatePostUsecase
}
export const postPostHandlerMiddlewares = ['addPermissionContextMiddleware', 'validateUserMiddleware']

export const postPostHandler: RouteHandlerConstructor<Params> =
  (params: Params) => async (req: IRequest, res: IResponse) => {
    const { usecase } = params

    const { title, description } = createPostSchema.parse(req.getBody())

    const { permissionContext, validateUserMiddlewareResponse } = req.getRequestContextStore()

    const response = await usecase({
      permissionContext: permissionContext!,
      title,
      description,
      user: validateUserMiddlewareResponse!.user,
    })

    return res.sendJsonResponse(201, response)
  }
