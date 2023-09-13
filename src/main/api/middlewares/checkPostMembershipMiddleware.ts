import { Request, Response } from 'express'
import { RouteHandlerConstructor } from './types'
import { CheckPostMembershipUsecase } from '../../../domain/usecases/checkPostMember'

type Params = {
  usecase: CheckPostMembershipUsecase
}

export const checkPostMembershipMiddleware: RouteHandlerConstructor<Params> =
  (params: Params) => async (req: Request, _res: Response) => {
    const { usecase } = params

    const user = req.validateUserMiddlewareResponse!.user
    const post = req.getPostMiddlewareResponse!.post
    const postMembers = req.getPostMembersMiddlewareResponse!.postMembers

    const postMember = await usecase({
      permissionContext: req.permissionContext!,
      user,
      post,
      postMembers,
    })

    req.checkPostMembershipMiddlewareResponse = {
      postMember,
    }
  }
