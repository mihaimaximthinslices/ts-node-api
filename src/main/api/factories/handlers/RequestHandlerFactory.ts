import { MakeHandlerParams } from './makeRequestHandlerFactory'
import { IRequestHandler } from '../../../../domain/handlers/requestHandler'

export interface RequestHandlerFactory {
  make: (name: string) => IRequestHandler
  getHandlerNames: () => string[]
}

export type MakeRequestHandlerFactory = (dependencies: MakeHandlerParams) => RequestHandlerFactory
