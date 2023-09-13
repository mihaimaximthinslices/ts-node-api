import { RouteHandlerConstructor } from '../middlewares'
import { Request, Response } from 'express'
import { InvalidInputError } from '../../../domain/errors'
import { UpdatePostCommentUsecase } from '../../../domain/usecases/updatePostComment'

type Params = {
  usecase: UpdatePostCommentUsecase
}
export const patchPostCommentHandlerMiddlewares = ['addPermissionContextMiddleware', 'validateUserMiddleware']
export const patchPostCommentHandler: RouteHandlerConstructor<Params> =
  (params: Params) => async (req: Request, res: Response) => {
    const { usecase } = params

    const { postId, commentId } = req.params

    const { text } = req.body

    if (!postId) {
      throw new InvalidInputError('postId param is required')
    }
    if (!commentId) {
      throw new InvalidInputError('commentId param is required')
    }

    const response = await usecase({
      user: req.validateUserMiddlewareResponse!.user,
      postId,
      commentId,
      text,
    })

    return res.status(204).json(response)
  }
