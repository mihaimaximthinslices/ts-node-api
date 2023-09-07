import { NextFunction, Request, RequestHandler, Response } from 'express'
import { MiddlewareFactory } from './types'
import { makeValidateUserMiddleware } from './makeValidateUserMiddleware'

const middlewareFactories: Record<string, (_req: Request, _res: Response) => Promise<RequestHandler>> = {
  validateUserMiddleware: makeValidateUserMiddleware,
}

export const middlewareFactory: MiddlewareFactory = {
  make: (name: string) => {
    const makeHandlerFunction = middlewareFactories[name]

    if (!makeHandlerFunction) throw new Error('Invalid handler')

    return async (req: Request, res: Response, next: NextFunction) => {
      const handler = await makeHandlerFunction(req, res)

      return handler(req, res, next)
    }
  },
  getMiddlewareNames: () => {
    return Object.keys(middlewareFactories)
  },
}
