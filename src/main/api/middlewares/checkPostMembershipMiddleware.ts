import { RouteHandlerConstructor } from './types'
import { CheckPostMembershipUsecase } from '../../../domain/usecases/checkPostMember'
import { IRequest } from '../../../domain/handlers/request'
import { IResponse } from '../../../domain/handlers/response'

type Params = {
  usecase: CheckPostMembershipUsecase
}

export const checkPostMembershipMiddleware: RouteHandlerConstructor<Params> =
  (params: Params) => async (req: IRequest, _res: IResponse) => {
    const { usecase } = params

    const {
      permissionContext,
      validateUserMiddlewareResponse,
      getPostMiddlewareResponse,
      getPostMembersMiddlewareResponse,
    } = req.getRequestContextStore()

    const user = validateUserMiddlewareResponse!.user
    const post = getPostMiddlewareResponse!.post
    const postMembers = getPostMembersMiddlewareResponse!.postMembers

    const postMember = await usecase({
      permissionContext: permissionContext!,
      user,
      post,
      postMembers,
    })

    const requestContextStore = req.getRequestContextStore()

    requestContextStore.checkPostMembershipMiddlewareResponse = {
      postMember,
    }

    req.setRequestContextStore(requestContextStore)
  }
