import { NextFunction, Request, RequestHandler, Response } from 'express'
import { MiddlewareFactory } from './MiddlewareFactory'
import { makeValidateUserMiddleware } from './makeValidateUserMiddleware'
import { ErrorHandlerFactory, makeErrorHandlerFactory } from '../errorHandlers'
import { makeJSRepositoryFactory } from '../repositories/makeRepositoryFactory'
import { makeConsoleLogger } from '../loggers'
import { RepositoryFactory } from '../repositories/RepositoryFactory'
import { Logger } from '../../../../domain/shared'

export type MakeMiddlewareParams = {
  errorHandlerFactory: ErrorHandlerFactory
  repositoryFactory: RepositoryFactory
  logger: Logger
}
const middlewareFactories: Record<string, (params?: MakeMiddlewareParams) => Promise<RequestHandler>> = {
  validateUserMiddleware: makeValidateUserMiddleware,
}

export const makeMiddlewareFactory = (): MiddlewareFactory => {
  const errorHandlerFactory = makeErrorHandlerFactory()
  const repositoryFactory = makeJSRepositoryFactory()
  const logger = makeConsoleLogger()

  return {
    make: (name: string) => {
      const makeHandlerFunction = middlewareFactories[name]

      if (!makeHandlerFunction) throw new Error('Invalid middleware!')

      return async (req: Request, res: Response, next: NextFunction) => {
        const handler = await makeHandlerFunction({
          repositoryFactory,
          logger,
          errorHandlerFactory,
        })

        return handler(req, res, next)
      }
    },
    getMiddlewareNames: () => {
      return Object.keys(middlewareFactories)
    },
  }
}
