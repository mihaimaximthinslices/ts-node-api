import { RouteHandlerConstructor } from '../middlewares'
import { Request, Response } from 'express'
import { InvalidInputError } from '../../../domain/errors'
import { RemovePostCommentUsecase } from '../../../domain/usecases/removePostComment'

type Params = {
  usecase: RemovePostCommentUsecase
}

export const deletePostCommentHandler: RouteHandlerConstructor<Params> =
  (params: Params) => async (req: Request, res: Response) => {
    const { usecase } = params

    const { commentId } = req.params

    if (!commentId) {
      throw new InvalidInputError('commentId param is required')
    }

    const response = await usecase({
      permissionContext: req.permissionContext!,
      isDomainEvent: false,
      user: req.validateUserMiddlewareResponse!.user,
      post: req.getPostMiddlewareResponse!.post,
      postMembers: req.getPostMembersMiddlewareResponse!.postMembers,
      comment: req.getCommentMiddleware!.comment,
    })

    return res.status(204).json(response)
  }
