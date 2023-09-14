import { RouteHandlerConstructor } from './types'
import { GetPostMembersUsecase } from '../../../domain/usecases/getPostMembers'
import { IRequest } from '../../../domain/handlers/request'
import { IResponse } from '../../../domain/handlers/response'

type Params = {
  usecase: GetPostMembersUsecase
}

export const getPostMembersMiddleware: RouteHandlerConstructor<Params> =
  (params: Params) => async (req: IRequest, _res: IResponse) => {
    const { usecase } = params

    const { validateUserMiddlewareResponse, getPostMiddlewareResponse } = req.getRequestContextStore()

    const postMembers = await usecase({
      user: validateUserMiddlewareResponse!.user,
      post: getPostMiddlewareResponse!.post,
    })

    const requestContextStore = req.getRequestContextStore()

    requestContextStore.getPostMembersMiddlewareResponse = {
      postMembers,
    }

    req.setRequestContextStore(requestContextStore)
  }
