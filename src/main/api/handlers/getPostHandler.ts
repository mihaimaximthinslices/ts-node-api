import { Request, Response } from 'express'
import { RouteHandlerConstructor } from '../middlewares'

type Params = void
export const getPostHandlerMiddlewares = [
  'addPermissionContextMiddleware',
  'validateUserMiddleware',
  'getPostMiddleware',
  'getPostMembersMiddleware',
  'checkPostMembershipMiddleware',
]

export const getPostHandler: RouteHandlerConstructor<Params> =
  (_params: Params) => async (req: Request, res: Response) => {
    return res.status(200).json(req.getPostMiddlewareResponse!.post!)
  }
