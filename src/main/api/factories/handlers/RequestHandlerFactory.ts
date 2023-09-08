import { RequestHandler } from 'express'

export interface RequestHandlerFactory {
  make: (name: string) => RequestHandler
  getHandlerNames: () => string[]
}
