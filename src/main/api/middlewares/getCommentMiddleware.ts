import { RouteHandlerConstructor } from './types'
import { InvalidInputError } from '../../../domain/errors'
import { GetCommentUsecase } from '../../../domain/usecases'
import { IRequest } from '../../../domain/handlers/request'
import { IResponse } from '../../../domain/handlers/response'

type Params = {
  usecase: GetCommentUsecase
}

export const getCommentMiddleware: RouteHandlerConstructor<Params> =
  (params: Params) => async (req: IRequest, _res: IResponse) => {
    const { commentId } = req.getPathParams()

    if (!commentId) {
      throw new InvalidInputError('postId query param is required')
    }

    const { usecase } = params

    const {
      permissionContext,
      validateUserMiddlewareResponse,
      getPostMiddlewareResponse,
      getPostMembersMiddlewareResponse,
    } = req.getRequestContextStore()

    const comment = await usecase({
      permissionContext: permissionContext!,
      user: validateUserMiddlewareResponse!.user,
      post: getPostMiddlewareResponse!.post,
      postMembers: getPostMembersMiddlewareResponse!.postMembers,
      commentId,
    })

    const requestContextStore = req.getRequestContextStore()

    requestContextStore.getPostCommentMiddlewareResponse = {
      comment,
    }

    req.setRequestContextStore(requestContextStore)
  }
