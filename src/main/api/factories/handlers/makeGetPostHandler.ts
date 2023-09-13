import { withLogging } from '../../../../domain/shared'
import { withMiddleware } from '../../middlewares'
import { MakeHandlerParams } from './makeRequestHandlerFactory'
import { withErrorHandling } from '../errorHandlers'
import { getPostHandler } from '../../handlers/getPostHandler'

export async function makeGetPostHandler(params?: MakeHandlerParams) {
  const { middlewareFactory, errorHandlerFactory, logger } = params!

  const middlewares = middlewareFactory.makeMany([
    'addPermissionContextMiddleware',
    'validateUserMiddleware',
    'getPostMiddleware',
    'getPostMemberMiddleware',
    'validatePostMemberMiddleware',
  ])

  const sharedErrorHandler = errorHandlerFactory.make('sharedErrorHandler')

  return withLogging(
    withErrorHandling(withMiddleware(middlewares, getPostHandler()), sharedErrorHandler),
    logger,
    'Handler',
    'getPostHandler',
  )
}
