import { NextFunction, Request, RequestHandler, Response } from 'express'

export const withMiddleware = (middleware: Array<RequestHandler>, handler: RequestHandler) => {
  return async (req: Request, res: Response, next: NextFunction) => {
    for (const mwh of middleware) {
      await new Promise((resolve, reject) =>
        useMiddleware(mwh)(req, res, resolve as () => void, reject as (err: Error) => Error),
      )
    }

    await handler(req, res, next)
  }
}

const useMiddleware =
  (middleware: RequestHandler) =>
  async (req: Request, res: Response, next: () => void, error: (err: Error) => Error) => {
    try {
      await middleware(req, res, next)
      next()
    } catch (err) {
      error(err as Error)
    }
  }
