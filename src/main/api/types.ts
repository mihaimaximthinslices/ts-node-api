import { RequestHandler } from 'express'

export type RouteHandlerConstructor<T> = (params: T) => RequestHandler
