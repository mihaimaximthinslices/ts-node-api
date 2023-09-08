import { makeGetPostsHandler } from './makeGetPostsHandler'
import { NextFunction, Request, RequestHandler, Response } from 'express'
import { RequestHandlerFactory } from './RequestHandlerFactory'
import { MiddlewareFactory, makeMiddlewareFactory } from '../middlewares'
import { ErrorHandlerFactory, makeErrorHandlerFactory } from '../../errorHandlers'

export type MakeHandlerParams = {
  middlewareFactory?: MiddlewareFactory
  errorHandlerFactory: ErrorHandlerFactory
}

const requestHandlerFactories: Record<string, (MakeHandlerParams: MakeHandlerParams) => Promise<RequestHandler>> = {
  getPostsHandler: makeGetPostsHandler,
}

export const makeRequestHandlerFactory = (): RequestHandlerFactory => {
  const middlewareFactory = makeMiddlewareFactory()
  const errorHandlerFactory = makeErrorHandlerFactory()

  return {
    make: (name: string) => {
      const makeHandlerFunction = requestHandlerFactories[name]

      if (!makeHandlerFunction) throw new Error('Invalid handler')

      return async (req: Request, res: Response, next: NextFunction) => {
        const handler = await makeHandlerFunction({
          middlewareFactory,
          errorHandlerFactory,
        })

        return handler(req, res, next)
      }
    },
    getHandlerNames: () => {
      return Object.keys(requestHandlerFactories)
    },
  }
}
