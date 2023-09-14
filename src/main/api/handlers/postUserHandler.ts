import { CreateUserUsecase } from '../../../domain/usecases'
import { RouteHandlerConstructor } from '../middlewares'
import { InvalidInputError } from '../../../domain/errors'
import { registrationSchema } from '../../shared/validationSchemas'
import { IRequest } from '../../../domain/handlers/request'
import { IResponse } from '../../../domain/handlers/response'

type Params = {
  usecase: CreateUserUsecase
}
export const postUserHandlerMiddlewares = ['addPermissionContextMiddleware']
export const postUserHandler: RouteHandlerConstructor<Params> =
  (params: Params) => async (req: IRequest, res: IResponse) => {
    const { usecase } = params

    const sessionData = req.getSessionData()

    const { user: sessionUser } = sessionData

    if (sessionUser) {
      throw new InvalidInputError('You cannot create an account if you are logged in')
    }

    const { email, password, username } = registrationSchema.parse(req.getBody())

    const { permissionContext } = req.getRequestContextStore()

    const response = await usecase({
      permissionContext: permissionContext!,
      email,
      password,
      username,
    })

    return res.sendJsonResponse(200, response)
  }
