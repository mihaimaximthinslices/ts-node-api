import { makeGetPostsHandler } from './makeGetPostsHandler'
import { NextFunction, Request, RequestHandler, Response } from 'express'
import { RequestHandlerFactory } from './RequestHandlerFactory'
import { MiddlewareFactory } from '../middlewares'
import { ErrorHandlerFactory } from '../errorHandlers'
import { Logger } from '../../../../domain/shared'
import { RepositoryFactory } from '../repositories/RepositoryFactory'

export type MakeHandlerParams = {
  middlewareFactory: MiddlewareFactory
  errorHandlerFactory: ErrorHandlerFactory
  repositoryFactory: RepositoryFactory
  logger: Logger
}

const requestHandlerFactories: Record<string, (MakeHandlerParams: MakeHandlerParams) => Promise<RequestHandler>> = {
  getPostsHandler: makeGetPostsHandler,
}

export const makeRequestHandlerFactory = (dependencies: MakeHandlerParams): RequestHandlerFactory => {
  return {
    make: (name: string) => {
      const makeHandlerFunction = requestHandlerFactories[name]

      if (!makeHandlerFunction) throw new Error('Invalid handler')

      return async (req: Request, res: Response, next: NextFunction) => {
        const handler = await makeHandlerFunction({
          ...dependencies,
        })

        return handler(req, res, next)
      }
    },
    getHandlerNames: () => {
      return Object.keys(requestHandlerFactories)
    },
  }
}
