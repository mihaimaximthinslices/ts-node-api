import { ErrorHandlerFactory } from './ErrorHandlerFactory'
import { makeSharedErrorHandler } from './makeSharedErrorHandler'
import { IResponse } from '../../../../domain/handlers/response'

const errorHandlerFactories: Record<string, (err: Error, res: IResponse) => void> = {
  sharedErrorHandler: makeSharedErrorHandler,
}

export const makeErrorHandlerFactory = (): ErrorHandlerFactory => {
  return {
    make: (name: string) => {
      const makeErrorHandlerFunction = errorHandlerFactories[name]

      if (!makeErrorHandlerFunction) throw new Error('Invalid error handler')

      return makeErrorHandlerFunction
    },
    getErrorHandlerNames: () => {
      return Object.keys(errorHandlerFactories)
    },
  }
}
