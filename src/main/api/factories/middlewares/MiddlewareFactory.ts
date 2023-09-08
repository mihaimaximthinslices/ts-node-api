import { RequestHandler } from 'express'

export interface MiddlewareFactory {
  make: (name: string) => RequestHandler
  getMiddlewareNames: () => string[]
}
