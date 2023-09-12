import { RouteHandlerConstructor } from '../middlewares'
import { Request, Response } from 'express'
import { createPostMemberSchema } from '../../shared/validationSchemas'
import { CreatePostMemberUsecase } from '../../../domain/usecases/createPostMember'

type Params = {
  usecase: CreatePostMemberUsecase
}

export const postPostMemberHandler: RouteHandlerConstructor<Params> =
  (params: Params) => async (req: Request, res: Response) => {
    const { usecase } = params

    const { email } = createPostMemberSchema.parse(req.body)

    const response = await usecase({
      user: req.validateUserMiddlewareResponse!.user,
      post: req.getPostMiddlewareResponse!.post,
      role: 'GUEST',
      newUserEmail: email,
    })

    return res.status(201).json(response)
  }
