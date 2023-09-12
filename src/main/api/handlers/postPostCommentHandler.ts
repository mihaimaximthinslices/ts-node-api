import { RouteHandlerConstructor } from '../middlewares'
import { Request, Response } from 'express'
import { createCommentSchema } from '../../shared/validationSchemas'
import { CreateCommentUsecase } from '../../../domain/usecases/createPostComment'

type Params = {
  usecase: CreateCommentUsecase
}

export const postPostCommentHandler: RouteHandlerConstructor<Params> =
  (params: Params) => async (req: Request, res: Response) => {
    const { usecase } = params

    const { text } = createCommentSchema.parse(req.body)

    const response = await usecase({
      permissionContext: req.permissionContext!,
      user: req.validateUserMiddlewareResponse!.user,
      post: req.getPostMiddlewareResponse!.post,
      text,
    })

    return res.status(201).json(response)
  }
