import { IRequestHandler } from '../../../domain/handlers/requestHandler'
import { IRequest } from '../../../domain/handlers/request'
import { IResponse } from '../../../domain/handlers/response'

export const withMiddleware = (middleware: Array<IRequestHandler>, handler: IRequestHandler) => {
  return async (req: IRequest, res: IResponse) => {
    for (const mwh of middleware) {
      await new Promise((resolve, reject) =>
        useMiddleware(mwh)(req, res, resolve as () => void, reject as (err: Error) => Error),
      )
    }

    await handler(req, res)
  }
}

const useMiddleware =
  (middleware: IRequestHandler) =>
  async (req: IRequest, res: IResponse, next: () => void, error: (err: Error) => Error) => {
    try {
      await middleware(req, res)
      next()
    } catch (err) {
      error(err as Error)
    }
  }
