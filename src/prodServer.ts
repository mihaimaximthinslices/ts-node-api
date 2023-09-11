import express from 'express'
import 'dotenv/config'
import session from 'express-session'
import genFunc from 'connect-pg-simple'
import { setupServer } from './main/api/setupServer'
import { MakeHandlerParams, makeRequestHandlerFactory } from './main/api/factories/handlers'
import { ErrorHandlerFactory, makeErrorHandlerFactory } from './main/api/factories/errorHandlers'
import { makePrismaRepositoryFactory } from './main/api/factories/repositories/makeRepositoryFactory'
import { makeMiddlewareFactory, MakeMiddlewareParams } from './main/api/factories/middlewares'
import { makeConsoleLogger } from './main/api/factories/loggers'
import { User } from './domain/entities'
import { makeDateGenerator } from './main/api/factories/generators'
import { makeUuidGenerator } from './main/api/factories/generators/uuidGenerator'
import { makeHashMethods } from './main/api/factories/hashMethods/makeHashMethods'
import { RepositoryFactory } from './main/api/factories/repositories/RepositoryFactory'
import { DateGenerator, HashMethods, Logger, UuidGenerator } from './domain/shared'
import { ConcreteEventEmitter } from './main/api/factories/events/makeDomainEventEmitter'

const prodServer = express()

const PostgresqlStore = genFunc(session)
const sessionStore = new PostgresqlStore({
  conString: process.env.DATABASE_URL,
})

prodServer.use(express.json())

prodServer.use(
  session({
    secret: process.env.SESSION_SECRET!,
    resave: false,
    saveUninitialized: true,
    cookie: {
      httpOnly: true,
    },
    store: sessionStore,
  }),
)

declare module 'express-session' {
  interface SessionData {
    user: User
  }
}

export interface AllDependencies {
  errorHandlerFactory: ErrorHandlerFactory
  repositoryFactory: RepositoryFactory
  logger: Logger
  dateGenerator: DateGenerator
  uuidGenerator: UuidGenerator
  hashMethods: HashMethods
}

const dependencies: AllDependencies = {
  errorHandlerFactory: makeErrorHandlerFactory(),
  repositoryFactory: makePrismaRepositoryFactory(),
  logger: makeConsoleLogger(),
  dateGenerator: makeDateGenerator(),
  uuidGenerator: makeUuidGenerator(),
  hashMethods: makeHashMethods(),
}

const domainEventEmitter = new ConcreteEventEmitter(dependencies)

const middlewareFactoryDependencies: MakeMiddlewareParams = { ...dependencies, domainEventEmitter }

const requestHandlerFactoryDependencies: MakeHandlerParams = {
  ...dependencies,
  middlewareFactory: makeMiddlewareFactory(middlewareFactoryDependencies),
  domainEventEmitter: domainEventEmitter,
}

setupServer({
  server: prodServer,
  requestHandlerFactory: makeRequestHandlerFactory(requestHandlerFactoryDependencies),
})

export default prodServer
