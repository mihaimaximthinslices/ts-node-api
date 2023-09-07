import { Request, Response } from 'express'
import { middlewareFactory } from '../factories/middlewares'

export const useValidateUserMiddleware = async (
  req: Request,
  res: Response,
  next: () => void,
  error: (err: Error) => Error,
) => {
  const validateUserMiddleware = middlewareFactory.make('validateUserMiddleware')
  try {
    await validateUserMiddleware(req, res, next)
    next()
  } catch (err) {
    error(err as Error)
  }
}
