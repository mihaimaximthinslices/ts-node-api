import { MiddlewareFactory } from './MiddlewareFactory'
import { makeValidateUserMiddleware } from './makeValidateUserMiddleware'
import { ErrorHandlerFactory } from '../errorHandlers'
import { RepositoryFactory } from '../repositories/RepositoryFactory'
import { HashMethods, Logger } from '../../../../domain/shared'
import { DomainEventEmitter } from '../../../../domain/events'
import { makeGetPostMiddleware } from './makeGetPostMiddleware'
import { makeGetPostCommentMiddleware } from './makeGetPostCommentMiddleware'
import { makeGetPostMembersMiddleware } from './makeGetPostMembersMiddleware'
import { makeCheckPostMembershipMiddleware } from './makeCheckPostMembershipMiddleware'
import { makeAddPermissionContextMiddleware } from './makeAddPermissionContextMiddleware'
import { IRequestHandler } from '../../../../domain/handlers/requestHandler'
import { IRequest } from '../../../../domain/handlers/request'
import { IResponse } from '../../../../domain/handlers/response'

export type MakeMiddlewareParams = {
  errorHandlerFactory: ErrorHandlerFactory
  repositoryFactory: RepositoryFactory
  logger: Logger
  hashMethods: HashMethods
  domainEventEmitter: DomainEventEmitter
}
const middlewareFactories: Record<string, (params?: MakeMiddlewareParams) => Promise<IRequestHandler>> = {
  addPermissionContextMiddleware: makeAddPermissionContextMiddleware,
  validateUserMiddleware: makeValidateUserMiddleware,
  getPostMiddleware: makeGetPostMiddleware,
  getPostCommentMiddleware: makeGetPostCommentMiddleware,
  getPostMembersMiddleware: makeGetPostMembersMiddleware,
  checkPostMembershipMiddleware: makeCheckPostMembershipMiddleware,
}

export const makeMiddlewareFactory = (dependencies: MakeMiddlewareParams): MiddlewareFactory => {
  const makeFunction = (name: string) => {
    const makeHandlerFunction = middlewareFactories[name]

    if (!makeHandlerFunction) throw new Error(`Invalid middleware ${name}`)

    return async (req: IRequest, res: IResponse) => {
      const handler = await makeHandlerFunction({
        ...dependencies,
      })

      return handler(req, res)
    }
  }
  return {
    make: makeFunction,
    makeMany: (names: string[]) => {
      const middlewares = []
      for (let i = 0; i < names.length; i++) {
        const middleware = makeFunction(names[i]!)
        middlewares.push(middleware)
      }
      return middlewares
    },
    getMiddlewareNames: () => {
      return Object.keys(middlewareFactories)
    },
  }
}
