import { GetPostUsecase } from '../../../domain/usecases'
import { RouteHandlerConstructor } from './types'
import { InvalidInputError } from '../../../domain/errors'
import { IRequest } from '../../../domain/handlers/request'
import { IResponse } from '../../../domain/handlers/response'

type Params = {
  usecase: GetPostUsecase
}

export const getPostMiddleware: RouteHandlerConstructor<Params> =
  (params: Params) => async (req: IRequest, _res: IResponse) => {
    const { postId } = req.getPathParams()

    if (!postId) {
      throw new InvalidInputError('postId query param is required')
    }

    const { usecase } = params

    const { validateUserMiddlewareResponse } = req.getRequestContextStore()

    const post = await usecase({
      user: validateUserMiddlewareResponse!.user,
      postId,
    })

    const requestContextStore = req.getRequestContextStore()

    requestContextStore.getPostMiddlewareResponse = {
      post,
    }

    req.setRequestContextStore(requestContextStore)
  }
