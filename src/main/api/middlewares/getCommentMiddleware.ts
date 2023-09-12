import { Request, Response } from 'express'
import { RouteHandlerConstructor } from './types'
import { InvalidInputError } from '../../../domain/errors'
import { GetCommentUsecase } from '../../../domain/usecases'

type Params = {
  usecase: GetCommentUsecase
}

export const getCommentMiddleware: RouteHandlerConstructor<Params> =
  (params: Params) => async (req: Request, _res: Response) => {
    const { commentId } = req.params

    if (!commentId) {
      throw new InvalidInputError('postId query param is required')
    }

    const { usecase } = params

    const comment = await usecase({
      permissionContext: req.permissionContext!,
      user: req.validateUserMiddlewareResponse!.user,
      post: req.getPostMiddlewareResponse!.post,
      postMembers: req.getPostMembersMiddlewareResponse!.postMembers,
      commentId,
    })

    req.getCommentMiddleware = {
      comment,
    }
  }
