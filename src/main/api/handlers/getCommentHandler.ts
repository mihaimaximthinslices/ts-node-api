import { Request, Response } from 'express'
import { RouteHandlerConstructor } from '../middlewares'

type Params = void
export const getCommentHandler: RouteHandlerConstructor<Params> =
  (_params: Params) => async (req: Request, res: Response) => {
    return res.status(200).json(req.getCommentMiddleware!.comment!)
  }
