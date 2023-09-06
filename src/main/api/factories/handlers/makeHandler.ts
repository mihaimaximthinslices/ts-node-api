import { makeGetPostsHandler } from './makeGetPostsHandler'
import { NextFunction, Request, RequestHandler, Response } from 'express'
const handlerFactories: Record<string, (_req: Request, _res: Response) => Promise<RequestHandler>> = {
  getPostsHandler: makeGetPostsHandler,
}

export const makeHandler = (name: string) => {
  const makeHandlerFunction = handlerFactories[name]

  if (!makeHandlerFunction) throw new Error('Invalid handler')

  return async (req: Request, res: Response, next: NextFunction) => {
    const handler = await makeHandlerFunction(req, res)

    return handler(req, res, next)
  }
}
