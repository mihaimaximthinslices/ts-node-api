import { RouteHandlerConstructor } from '../middlewares'
import { Request, Response } from 'express'
import { RemovePostUsecase } from '../../../domain/usecases/removePost'
import { InvalidInputError } from '../../../domain/errors'

type Params = {
  usecase: RemovePostUsecase
}

export const deletePostHandler: RouteHandlerConstructor<Params> =
  (params: Params) => async (req: Request, res: Response) => {
    const { usecase } = params

    const { postId } = req.params

    if (!postId) {
      throw new InvalidInputError('postId query params is required')
    }

    const response = await usecase({
      permissionContext: req.permissionContext!,
      user: req.validateUserMiddlewareResponse!.user,
      post: req.getPostMiddlewareResponse!.post,
      postMembers: req.getPostMembersMiddlewareResponse!.postMembers,
    })

    return res.status(204).json(response)
  }
