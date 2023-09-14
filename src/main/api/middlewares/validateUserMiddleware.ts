import { ValidateUserUsecase } from '../../../domain/usecases'
import { RouteHandlerConstructor } from './types'
import { UnauthorizedError } from '../../../domain/errors'
import { IRequest } from '../../../domain/handlers/request'
import { IResponse } from '../../../domain/handlers/response'

type Params = {
  usecase: ValidateUserUsecase
}

export const validateUserMiddleware: RouteHandlerConstructor<Params> =
  (params: Params) => async (req: IRequest, _res: IResponse) => {
    const sessionData = req.getSessionData()
    const { user: sessionUser } = sessionData

    if (!sessionUser) {
      throw new UnauthorizedError('User')
    }

    const { email } = sessionUser

    const { usecase } = params

    const user = await usecase({
      email,
    })

    const requestContextStore = req.getRequestContextStore()

    requestContextStore.validateUserMiddlewareResponse = {
      user,
    }

    req.setRequestContextStore(requestContextStore)
  }
