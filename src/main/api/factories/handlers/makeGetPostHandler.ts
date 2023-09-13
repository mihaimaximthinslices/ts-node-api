import { withLogging } from '../../../../domain/shared'
import { withMiddleware } from '../../middlewares'
import { MakeHandlerParams } from './makeRequestHandlerFactory'
import { withErrorHandling } from '../errorHandlers'
import { getPostHandler, getPostHandlerMiddlewares } from '../../handlers/getPostHandler'

export async function makeGetPostHandler(params?: MakeHandlerParams) {
  const { middlewareFactory, errorHandlerFactory, logger } = params!

  const middlewares = middlewareFactory.makeMany(getPostHandlerMiddlewares)

  const sharedErrorHandler = errorHandlerFactory.make('sharedErrorHandler')

  return withLogging(
    withErrorHandling(withMiddleware(middlewares, getPostHandler()), sharedErrorHandler),
    logger,
    'Handler',
    'getPostHandler',
  )
}
