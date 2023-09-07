import { Request, Response } from 'express'
export const withMiddleware = <T>(
  middleware: Array<(req: Request, res: Response, next: () => void, error: (err: Error) => Error) => void>,
  handler: (params: T, req: Request, res: Response) => Promise<void>,
) => {
  return async (params: T, req: Request, res: Response) => {
    for (const mw of middleware) {
      await new Promise((resolve, reject) => mw(req, res, resolve as () => void, reject as (err: Error) => Error))
    }

    await handler(params, req, res)
  }
}
