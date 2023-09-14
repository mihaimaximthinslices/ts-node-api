import { RouteHandlerConstructor } from '../middlewares'
import { RemovePostUsecase } from '../../../domain/usecases/removePost'
import { InvalidInputError } from '../../../domain/errors'
import { IRequest } from '../../../domain/handlers/request'
import { IResponse } from '../../../domain/handlers/response'

type Params = {
  usecase: RemovePostUsecase
}

export const deletePostHandlerMiddlewares = [
  'addPermissionContextMiddleware',
  'validateUserMiddleware',
  'getPostMiddleware',
  'getPostMembersMiddleware',
  'checkPostMembershipMiddleware',
]

export const deletePostHandler: RouteHandlerConstructor<Params> =
  (params: Params) => async (req: IRequest, res: IResponse) => {
    const { usecase } = params

    const { postId } = req.getPathParams()

    if (!postId) {
      throw new InvalidInputError('postId query params is required')
    }

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

    return res.sendJsonResponse(204, response)
  }
