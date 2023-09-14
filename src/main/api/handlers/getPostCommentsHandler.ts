import { RouteHandlerConstructor } from '../middlewares'
import { GetCommentsUsecase } from '../../../domain/usecases'
import { IRequest } from '../../../domain/handlers/request'
import { IResponse } from '../../../domain/handlers/response'

export const getPostCommentsHandlerMiddlewares = [
  'addPermissionContextMiddleware',
  'validateUserMiddleware',
  'getPostMiddleware',
  'getPostMembersMiddleware',
  'checkPostMembershipMiddleware',
]

type Params = {
  usecase: GetCommentsUsecase
}

export const getPostCommentsHandler: RouteHandlerConstructor<Params> =
  (params: Params) => async (req: IRequest, res: IResponse) => {
    const { usecase } = params

    const {
      permissionContext,
      validateUserMiddlewareResponse,
      getPostMiddlewareResponse,
      getPostMembersMiddlewareResponse,
    } = req.getRequestContextStore()

    const response = await usecase({
      permissionContext: permissionContext!,
      user: validateUserMiddlewareResponse!.user,
      post: getPostMiddlewareResponse!.post,
      postMembers: getPostMembersMiddlewareResponse!.postMembers,
    })

    return res.sendJsonResponse(200, response)
  }
