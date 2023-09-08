import { makeGetPostsHandler } from './makeGetPostsHandler'
import { NextFunction, Request, RequestHandler, Response } from 'express'
import { RequestHandlerFactory } from './types'
import { MiddlewareFactory, middlewareFactory } from '../middlewares'

export type MakeHandlerParams = {
  middlewareFactory?: MiddlewareFactory
}

const requestHandlerFactories: Record<string, (MakeHandlerParams: MakeHandlerParams) => Promise<RequestHandler>> = {
  getPostsHandler: makeGetPostsHandler,
}

export const requestHandlerFactory: RequestHandlerFactory = {
  make: (name: string) => {
    const makeHandlerFunction = requestHandlerFactories[name]

    if (!makeHandlerFunction) throw new Error('Invalid handler')

    return async (req: Request, res: Response, next: NextFunction) => {
      const handler = await makeHandlerFunction({
        middlewareFactory,
      })

      return handler(req, res, next)
    }
  },
  makeMiddleware: (name: string) => {
    return middlewareFactory.make(name)
  },
  getHandlerNames: () => {
    return Object.keys(requestHandlerFactories)
  },
}
