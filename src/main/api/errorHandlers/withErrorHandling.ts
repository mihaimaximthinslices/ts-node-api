import { Request, Response } from 'express'

export const withErrorHandling =
  <T>(
    handler: (params: T, req: Request, res: Response) => Promise<void>,
    errorHandler: (err: Error, res: Response) => void,
  ) =>
  (params: T) =>
  async (req: Request, res: Response) => {
    try {
      await handler(params, req, res)
    } catch (err) {
      errorHandler(err as Error, res)
    }
  }
