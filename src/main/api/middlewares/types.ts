import { IRequestContextStore } from '../../../domain/handlers/request'
import { IRequestHandler } from '../../../domain/handlers/requestHandler'

declare global {
  namespace Express {
    interface Request {
      reqContext: IRequestContextStore
    }
  }
}

export type RouteHandlerConstructor<T> = (params: T) => IRequestHandler
