import { RouteHandlerConstructor } from '../middlewares'
import { IRequest } from '../../../domain/handlers/request'
import { IResponse } from '../../../domain/handlers/response'

type Params = void
export const logoutHandler: RouteHandlerConstructor<Params> =
  (_params: Params) => async (req: IRequest, res: IResponse) => {
    req.destroySession(() => {
      res.sendJsonResponse(200, {
        message: 'You are now logged out',
      })
    })
  }
