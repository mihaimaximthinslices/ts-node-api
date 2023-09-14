import { RouteHandlerConstructor } from '../middlewares'
import { InvalidInputError } from '../../../domain/errors'
import { UpdatePostCommentUsecase } from '../../../domain/usecases/updatePostComment'
import { IRequest } from '../../../domain/handlers/request'
import { IResponse } from '../../../domain/handlers/response'

type Params = {
  usecase: UpdatePostCommentUsecase
}
export const patchPostCommentHandlerMiddlewares = ['addPermissionContextMiddleware', 'validateUserMiddleware']
export const patchPostCommentHandler: RouteHandlerConstructor<Params> =
  (params: Params) => async (req: IRequest, res: IResponse) => {
    const { usecase } = params

    const { postId, commentId } = req.getPathParams()

    const { text } = req.getBody()

    if (!postId) {
      throw new InvalidInputError('postId param is required')
    }
    if (!commentId) {
      throw new InvalidInputError('commentId param is required')
    }

    const { validateUserMiddlewareResponse } = req.getRequestContextStore()

    const response = await usecase({
      user: validateUserMiddlewareResponse!.user,
      postId,
      commentId,
      text,
    })

    return res.sendJsonResponse(204, response)
  }
