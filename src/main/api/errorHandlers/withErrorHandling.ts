import { NextFunction, Request, RequestHandler, Response } from 'express'

export const withErrorHandling =
  (handler: RequestHandler, errorHandler: (err: Error, res: Response) => void) =>
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      await handler(req, res, next)
    } catch (err) {
      errorHandler(err as Error, res)
    }
  }
