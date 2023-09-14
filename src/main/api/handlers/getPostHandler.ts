import { RouteHandlerConstructor } from '../middlewares'
import { IRequest } from '../../../domain/handlers/request'
import { IResponse } from '../../../domain/handlers/response'

type Params = void
export const getPostHandlerMiddlewares = [
  'addPermissionContextMiddleware',
  'validateUserMiddleware',
  'getPostMiddleware',
  'getPostMembersMiddleware',
  'checkPostMembershipMiddleware',
]

export const getPostHandler: RouteHandlerConstructor<Params> =
  (_params: Params) => async (req: IRequest, res: IResponse) => {
    const { getPostMiddlewareResponse } = req.getRequestContextStore()
    return res.sendJsonResponse(200, getPostMiddlewareResponse!.post)
  }
