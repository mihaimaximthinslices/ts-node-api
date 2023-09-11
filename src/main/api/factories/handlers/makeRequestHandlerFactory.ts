import { makeGetPostsHandler } from './makeGetPostsHandler'
import { NextFunction, Request, RequestHandler, Response } from 'express'
import { MakeRequestHandlerFactory, RequestHandlerFactory } from './RequestHandlerFactory'
import { MiddlewareFactory } from '../middlewares'
import { ErrorHandlerFactory } from '../errorHandlers'
import { DateGenerator, HashMethods, Logger, UuidGenerator } from '../../../../domain/shared'
import { RepositoryFactory } from '../repositories/RepositoryFactory'
import { makeLoginHandler } from './makeLoginHandler'
import { makeLogoutHandler } from './makeLogoutHandler'
import { makePostUserHandler } from './makePostUserHandler'

export type MakeHandlerParams = {
  middlewareFactory: MiddlewareFactory
  errorHandlerFactory: ErrorHandlerFactory
  repositoryFactory: RepositoryFactory
  logger: Logger
  dateGenerator: DateGenerator
  uuidGenerator: UuidGenerator
  hashMethods: HashMethods
}

const requestHandlerFactories: Record<string, (MakeHandlerParams: MakeHandlerParams) => Promise<RequestHandler>> = {
  getPostsHandler: makeGetPostsHandler,
  loginHandler: makeLoginHandler,
  logoutHandler: makeLogoutHandler,
  postUserHandler: makePostUserHandler,
}

export const makeRequestHandlerFactory: MakeRequestHandlerFactory = (
  dependencies: MakeHandlerParams,
): RequestHandlerFactory => {
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
