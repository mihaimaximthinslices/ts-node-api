import { RequestHandler } from 'express'

import { MakeHandlerParams } from './makeRequestHandlerFactory'

export interface RequestHandlerFactory {
  make: (name: string) => RequestHandler
  getHandlerNames: () => string[]
}

export type MakeRequestHandlerFactory = (dependencies: MakeHandlerParams) => RequestHandlerFactory
