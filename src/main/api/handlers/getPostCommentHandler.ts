import { Request, Response } from 'express'
import { RouteHandlerConstructor } from '../middlewares'

type Params = void
export const getPostCommentHandlerMiddlewares = [
  'addPermissionContextMiddleware',
  'validateUserMiddleware',
  'getPostMiddleware',
  'getPostMembersMiddleware',
  'checkPostMembershipMiddleware',
  'getPostCommentMiddleware',
]
export const getPostCommentHandler: RouteHandlerConstructor<Params> =
  (_params: Params) => async (req: Request, res: Response) => {
    return res.status(200).json(req.getPostCommentMiddlewareResponse!.comment!)
  }
