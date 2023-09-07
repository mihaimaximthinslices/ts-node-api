import { makeGetPostsHandler } from './makeGetPostsHandler'
import { NextFunction, Request, RequestHandler, Response } from 'express'
import { RequestHandlerFactory } from './types'

const requestHandlerFactories: Record<string, (_req: Request, _res: Response) => Promise<RequestHandler>> = {
  getPostsHandler: makeGetPostsHandler,
}

export const requestHandlerFactory: RequestHandlerFactory = {
  make: (name: string) => {
    const makeHandlerFunction = requestHandlerFactories[name]

    if (!makeHandlerFunction) throw new Error('Invalid handler')

    return async (req: Request, res: Response, next: NextFunction) => {
      const handler = await makeHandlerFunction(req, res)

      return handler(req, res, next)
    }
  },
  getHandlerNames: () => {
    return Object.keys(requestHandlerFactories)
  },
}
