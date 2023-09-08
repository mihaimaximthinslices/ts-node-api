import express from 'express'
import { setupServer } from './main/api/setupServer'
import { MakeHandlerParams, makeRequestHandlerFactory } from './main/api/factories/handlers'
import { makeErrorHandlerFactory } from './main/api/factories/errorHandlers'
import { makeJSRepositoryFactory } from './main/api/factories/repositories/makeRepositoryFactory'
import { makeMiddlewareFactory } from './main/api/factories/middlewares'
import { makeConsoleLogger } from './main/api/factories/loggers'

const prodServer = express()

const requestHandlerFactoryDependencies: MakeHandlerParams = {
  errorHandlerFactory: makeErrorHandlerFactory(),
  repositoryFactory: makeJSRepositoryFactory(),
  middlewareFactory: makeMiddlewareFactory(),
  logger: makeConsoleLogger(),
}

setupServer({
  server: prodServer,
  requestHandlerFactory: makeRequestHandlerFactory(requestHandlerFactoryDependencies),
})

export default prodServer
