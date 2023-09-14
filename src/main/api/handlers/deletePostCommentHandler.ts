import { RouteHandlerConstructor } from '../middlewares'
import { InvalidInputError } from '../../../domain/errors'
import { RemovePostCommentUsecase } from '../../../domain/usecases/removePostComment'
import { IRequest } from '../../../domain/handlers/request'
import { IResponse } from '../../../domain/handlers/response'

type Params = {
  usecase: RemovePostCommentUsecase
}

export const deletePostCommentHandlerMiddlewares = [
  'addPermissionContextMiddleware',
  'validateUserMiddleware',
  'getPostMiddleware',
  'getPostMembersMiddleware',
  'checkPostMembershipMiddleware',
  'getPostCommentMiddleware',
]
export const deletePostCommentHandler: RouteHandlerConstructor<Params> =
  (params: Params) => async (req: IRequest, res: IResponse) => {
    const { usecase } = params

    const { commentId } = req.getPathParams()

    if (!commentId) {
      throw new InvalidInputError('commentId param is required')
    }

    const {
      permissionContext,
      validateUserMiddlewareResponse,
      getPostMiddlewareResponse,
      getPostMembersMiddlewareResponse,
      getPostCommentMiddlewareResponse,
    } = req.getRequestContextStore()

    const response = await usecase({
      permissionContext: permissionContext!,
      isDomainEvent: false,
      user: validateUserMiddlewareResponse!.user,
      post: getPostMiddlewareResponse!.post,
      postMembers: getPostMembersMiddlewareResponse!.postMembers,
      comment: getPostCommentMiddlewareResponse!.comment,
    })

    return res.sendJsonResponse(204, response)
  }
