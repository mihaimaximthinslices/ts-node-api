import { RouteHandlerConstructor } from '../middlewares'
import { Request, Response } from 'express'
import { createPostSchema } from '../../shared/validationSchemas'
import { CreatePostUsecase } from '../../../domain/usecases'

type Params = {
  usecase: CreatePostUsecase
}

export const postPostHandler: RouteHandlerConstructor<Params> =
  (params: Params) => async (req: Request, res: Response) => {
    const { usecase } = params

    const { title, description } = createPostSchema.parse(req.body)

    const response = await usecase({
      permissionContext: req.permissionContext!,
      title,
      description,
      user: req.validateUserMiddlewareResponse!.user,
    })

    return res.status(201).json(response)
  }
