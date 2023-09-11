import { RouteHandlerConstructor } from '../middlewares'
import { Request, Response } from 'express'

type Params = void
export const logoutHandler: RouteHandlerConstructor<Params> =
  (_params: Params) => async (req: Request, res: Response) => {
    req.session.destroy(() => {
      return res.status(200).json({
        message: 'You are now logged out',
      })
    })
  }
