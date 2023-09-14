import { ValidateUserUsecase } from '../../../domain/usecases'
import { RouteHandlerConstructor } from '../middlewares'
import { InvalidInputError } from '../../../domain/errors'
import { IRequest } from '../../../domain/handlers/request'
import { IResponse } from '../../../domain/handlers/response'

type Params = {
  usecase: ValidateUserUsecase
}
export const loginHandlerMiddlewares = ['addPermissionContextMiddleware']

export const loginHandler: RouteHandlerConstructor<Params> =
  (params: Params) => async (req: IRequest, res: IResponse) => {
    const { usecase } = params

    let sessionData = req.getSessionData()

    const { user: sessionUser } = sessionData

    if (sessionUser) {
      throw new InvalidInputError('You are already logged in')
    }

    const { email, password } = req.getBody()

    if (!email || !password) {
      throw new InvalidInputError('Email and Password are required')
    }

    const user = await usecase({
      email: email as string,
      password: password as string,
    })

    sessionData = {
      ...sessionData,
      user: user,
    }
    req.setSessionData(sessionData)

    return res.sendJsonResponse(200, {
      message: 'You are now logged in',
    })
  }
