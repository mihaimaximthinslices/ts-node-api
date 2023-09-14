import { IResponse } from '../../../../domain/handlers/response'

export interface ErrorHandlerFactory {
  make: (name: string) => (err: Error, res: IResponse) => void
  getErrorHandlerNames: () => string[]
}
