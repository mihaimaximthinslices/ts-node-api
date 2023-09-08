import { RequestHandler } from 'express'

export interface RequestHandlerFactory {
  make: (name: string) => RequestHandler
  makeMiddleware: (name: string) => RequestHandler
  getHandlerNames: () => string[]
}
