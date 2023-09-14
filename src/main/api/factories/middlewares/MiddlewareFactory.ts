import { IRequestHandler } from '../../../../domain/handlers/requestHandler'

export interface MiddlewareFactory {
  make: (name: string) => IRequestHandler
  makeMany: (name: string[]) => IRequestHandler[]
  getMiddlewareNames: () => string[]
}
