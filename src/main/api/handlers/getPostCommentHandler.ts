import { RouteHandlerConstructor } from '../middlewares'
import { IRequest } from '../../../domain/handlers/request'
import { IResponse } from '../../../domain/handlers/response'

type Params = void
export const getPostCommentHandlerMiddlewares = [
  'addPermissionContextMiddleware',
  'validateUserMiddleware',
  'getPostMiddleware',
  'getPostMembersMiddleware',
  'checkPostMembershipMiddleware',
  'getPostCommentMiddleware',
]
export const getPostCommentHandler: RouteHandlerConstructor<Params> =
  (_params: Params) => async (req: IRequest, res: IResponse) => {
    const { getPostCommentMiddlewareResponse } = req.getRequestContextStore()

    return res.sendJsonResponse(200, getPostCommentMiddlewareResponse!.comment!)
  }
