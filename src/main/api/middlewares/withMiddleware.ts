import { NextFunction, Request, RequestHandler, Response } from 'express'
export const withMiddleware = (
  middleware: Array<(req: Request, res: Response, next: () => void, error: (err: Error) => Error) => void>,
  handler: RequestHandler,
) => {
  return async (req: Request, res: Response, next: NextFunction) => {
    for (const mw of middleware) {
      await new Promise((resolve, reject) => mw(req, res, resolve as () => void, reject as (err: Error) => Error))
    }

    await handler(req, res, next)
  }
}
