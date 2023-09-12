import { Request, Response } from 'express'
import { RouteHandlerConstructor } from './types'
import { ValidatePostMemberUsecase } from '../../../domain/usecases/validatePostMember'

type Params = {
  usecase: ValidatePostMemberUsecase
}

export const validatePostMemberMiddleware: RouteHandlerConstructor<Params> =
  (params: Params) => async (req: Request, _res: Response) => {
    const { usecase } = params

    const user = req.validateUserMiddlewareResponse!.user
    const post = req.getPostMiddlewareResponse!.post
    const postMembers = req.getPostMembersMiddlewareResponse!.postMembers

    await usecase({
      user,
      post,
      postMembers,
    })
  }
