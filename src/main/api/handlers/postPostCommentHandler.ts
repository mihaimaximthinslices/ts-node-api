import { RouteHandlerConstructor } from '../middlewares'
import { createCommentSchema } from '../../shared/validationSchemas'
import { CreateCommentUsecase } from '../../../domain/usecases/createPostComment'
import { IRequest } from '../../../domain/handlers/request'
import { IResponse } from '../../../domain/handlers/response'

type Params = {
  usecase: CreateCommentUsecase
}
export const postPostCommentHandlerMiddlewares = [
  'addPermissionContextMiddleware',
  'validateUserMiddleware',
  'getPostMiddleware',
  'getPostMembersMiddleware',
  'checkPostMembershipMiddleware',
]

export const postPostCommentHandler: RouteHandlerConstructor<Params> =
  (params: Params) => async (req: IRequest, res: IResponse) => {
    const { usecase } = params

    const { text } = createCommentSchema.parse(req.getBody())

    const { permissionContext, validateUserMiddlewareResponse, getPostMiddlewareResponse } =
      req.getRequestContextStore()

    const response = await usecase({
      permissionContext: permissionContext!,
      user: validateUserMiddlewareResponse!.user,
      post: getPostMiddlewareResponse!.post,
      text,
    })

    return res.sendJsonResponse(201, response)
  }
