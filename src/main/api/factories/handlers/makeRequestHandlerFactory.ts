import { makeGetPostsHandler } from './makeGetPostsHandler'
import { MakeRequestHandlerFactory, RequestHandlerFactory } from './RequestHandlerFactory'
import { MiddlewareFactory } from '../middlewares'
import { ErrorHandlerFactory } from '../errorHandlers'
import { DateGenerator, HashMethods, Logger, UuidGenerator } from '../../../../domain/shared'
import { RepositoryFactory } from '../repositories/RepositoryFactory'
import { makeLoginHandler } from './makeLoginHandler'
import { makeLogoutHandler } from './makeLogoutHandler'
import { makePostUserHandler } from './makePostUserHandler'
import { DomainEventEmitter } from '../../../../domain/events'
import { makePostPostHandler } from './makePostPostHandler'
import { makeGetPostHandler } from './makeGetPostHandler'
import { makePostCommentHandler } from './makePostCommentHandler'
import { makeGetPostCommentHandler } from './makeGetPostCommentHandler'
import { makeGetPostCommentsHandler } from './makeGetPostCommentsHandler'
import { makePostPostMemberHandler } from './makePostPostMemberHandler'
import { makeDeletePostHandler } from './makeDeletePostHandler'
import { makeDeletePostCommentHandler } from './makeDeletePostCommentHandler'
import { makePatchPostCommentHandler } from './makePatchPostCommentHandler'
import { IResponse } from '../../../../domain/handlers/response'
import { IRequest } from '../../../../domain/handlers/request'
import { IRequestHandler } from '../../../../domain/handlers/requestHandler'

export type MakeHandlerParams = {
  middlewareFactory: MiddlewareFactory
  errorHandlerFactory: ErrorHandlerFactory
  repositoryFactory: RepositoryFactory
  logger: Logger
  dateGenerator: DateGenerator
  uuidGenerator: UuidGenerator
  hashMethods: HashMethods
  domainEventEmitter: DomainEventEmitter
}

const requestHandlerFactories: Record<string, (MakeHandlerParams: MakeHandlerParams) => Promise<IRequestHandler>> = {
  getPostsHandler: makeGetPostsHandler,
  loginHandler: makeLoginHandler,
  logoutHandler: makeLogoutHandler,
  postUserHandler: makePostUserHandler,
  postPostHandler: makePostPostHandler,
  getPostHandler: makeGetPostHandler,
  postPostCommentHandler: makePostCommentHandler,
  getPostCommentHandler: makeGetPostCommentHandler,
  getPostCommentsHandler: makeGetPostCommentsHandler,
  postPostMemberHandler: makePostPostMemberHandler,
  deletePostHandler: makeDeletePostHandler,
  deletePostCommentHandler: makeDeletePostCommentHandler,
  patchPostCommentHandler: makePatchPostCommentHandler,
}

export const makeRequestHandlerFactory: MakeRequestHandlerFactory = (
  dependencies: MakeHandlerParams,
): RequestHandlerFactory => {
  return {
    make: (name: string) => {
      const makeHandlerFunction = requestHandlerFactories[name]

      if (!makeHandlerFunction) throw new Error('Invalid handler')

      return async (req: IRequest, res: IResponse) => {
        const handler = await makeHandlerFunction({
          ...dependencies,
        })

        return handler(req, res)
      }
    },
    getHandlerNames: () => {
      return Object.keys(requestHandlerFactories)
    },
  }
}
