import { NextFunction, Request, RequestHandler, Response } from 'express'
import { MiddlewareFactory } from './MiddlewareFactory'
import { makeValidateUserMiddleware } from './makeValidateUserMiddleware'
import { ErrorHandlerFactory } from '../errorHandlers'
import { RepositoryFactory } from '../repositories/RepositoryFactory'
import { HashMethods, Logger } from '../../../../domain/shared'
import { DomainEventEmitter } from '../../../../domain/events'
import { makeGetPostMiddleware } from './makeGetPostMiddleware'
import { makeGetPostCommentMiddleware } from './makeGetPostCommentMiddleware'
import { makeGetPostMemberMiddleware } from './makeGetPostMemberMiddleware'
import { makeValidatePostMemberMiddleware } from './makeValidatePostMemberMiddleware'
import { makeAddPermissionContextMiddleware } from './makeAddPermissionContextMiddleware'

export type MakeMiddlewareParams = {
  errorHandlerFactory: ErrorHandlerFactory
  repositoryFactory: RepositoryFactory
  logger: Logger
  hashMethods: HashMethods
  domainEventEmitter: DomainEventEmitter
}
const middlewareFactories: Record<string, (params?: MakeMiddlewareParams) => Promise<RequestHandler>> = {
  addPermissionContextMiddleware: makeAddPermissionContextMiddleware,
  validateUserMiddleware: makeValidateUserMiddleware,
  getPostMiddleware: makeGetPostMiddleware,
  getPostCommentMiddleware: makeGetPostCommentMiddleware,
  getPostMemberMiddleware: makeGetPostMemberMiddleware,
  validatePostMemberMiddleware: makeValidatePostMemberMiddleware,
}

export const makeMiddlewareFactory = (dependencies: MakeMiddlewareParams): MiddlewareFactory => {
  return {
    make: (name: string) => {
      const makeHandlerFunction = middlewareFactories[name]

      if (!makeHandlerFunction) throw new Error(`Invalid middleware ${name}`)

      return async (req: Request, res: Response, next: NextFunction) => {
        const handler = await makeHandlerFunction({
          ...dependencies,
        })

        return handler(req, res, next)
      }
    },
    getMiddlewareNames: () => {
      return Object.keys(middlewareFactories)
    },
  }
}
