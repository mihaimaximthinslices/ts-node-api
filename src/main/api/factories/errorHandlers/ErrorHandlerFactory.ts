import { Response } from 'express'

export interface ErrorHandlerFactory {
  make: (name: string) => (err: Error, res: Response) => void
  getErrorHandlerNames: () => string[]
}
