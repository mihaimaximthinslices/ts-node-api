import { RouteHandlerConstructor } from '../middlewares'
import { Request, Response } from 'express'
import { createCommentSchema } from '../../shared/validationSchemas'
import { CreateCommentUsecase } from '../../../domain/usecases/createComment'

type Params = {
  usecase: CreateCommentUsecase
}

export const postCommentHandler: RouteHandlerConstructor<Params> =
  (params: Params) => async (req: Request, res: Response) => {
    const { usecase } = params

    const { text } = createCommentSchema.parse(req.body)

    const response = await usecase({
      user: req.validateUserMiddlewareResponse!.user,
      post: req.getPostMiddleware!.post,
      text,
    })

    return res.status(201).json(response)
  }
