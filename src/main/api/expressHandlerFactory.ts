import { RequestHandlerFactory } from './factories/handlers'
import { RequestHandler } from 'express'

import { IRequest, IRequestContextStore, ISessionData, ParamsDictionary } from '../../domain/handlers/request'
import { Request, Response } from 'express'
import { IResponse } from '../../domain/handlers/response'
import { IRequestHandler } from '../../domain/handlers/requestHandler'

declare module 'express-session' {
  interface SessionData {
    data: ISessionData
  }
}

declare global {
  namespace Express {
    interface Request {
      reqContext: IRequestContextStore
    }
  }
}
export interface ExpressRequestHandlerFactory {
  make: (name: string) => RequestHandler
}

export const makeExpressRequestHandlerFactory = (
  requestHandlerFactory: RequestHandlerFactory,
): ExpressRequestHandlerFactory => {
  return {
    make: (name) => {
      return withExpressRequestHandlerAdapter(requestHandlerFactory.make(name))
    },
  }
}

declare module 'express-session' {
  interface SessionData {
    data: ISessionData
  }
}

declare global {
  namespace Express {
    interface Request {
      reqContext: IRequestContextStore
    }
  }
}

const buildReq = (expressReq: Request): IRequest => {
  const req: IRequest = {
    getBody: () => expressReq.body,
    getPathParams: () => expressReq.params,
    getQueryParams: () => {
      const quryParams: ParamsDictionary = {}
      for (const key in expressReq.query) {
        if (typeof expressReq.query[key] === 'string') {
          quryParams[key] = expressReq.query[key] as string
        }
      }
      return quryParams
    },
    setSessionData: (sessionData: ISessionData) => {
      expressReq.session.data = sessionData
    },
    getSessionData: () => {
      const sesData = expressReq.session.data
      if (sesData) {
        return sesData
      }

      return {}
    },

    destroySession: (returnCallback: (res: IResponse) => void) => {
      expressReq.session.destroy(returnCallback)
    },
    setRequestContextStore: (requestContextStore: IRequestContextStore) => {
      expressReq.reqContext = requestContextStore
    },
    getRequestContextStore: () => {
      if (!expressReq.reqContext) {
        expressReq.reqContext = {}
      }
      return expressReq.reqContext
    },
  }
  return req
}

const buildRes = (expressRes: Response): IResponse => {
  const res: IResponse = {
    /* eslint-disable  @typescript-eslint/no-explicit-any */
    sendJsonResponse: (status: number, response: any) => {
      expressRes.status(status).json(response)
    },
  }
  return res
}

const withExpressRequestHandlerAdapter = (handler: IRequestHandler) => {
  return async (req: Request, res: Response) => {
    return handler(buildReq(req), buildRes(res))
  }
}
