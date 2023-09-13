import { withLogging } from '../../../../domain/shared'
import { withMiddleware } from '../../middlewares'
import { MakeHandlerParams } from './makeRequestHandlerFactory'
import { withErrorHandling } from '../errorHandlers'
import { getPostCommentHandler, getPostCommentHandlerMiddlewares } from '../../handlers'

export async function makeGetPostCommentHandler(params?: MakeHandlerParams) {
  const { middlewareFactory, errorHandlerFactory, logger } = params!

  const middlewares = middlewareFactory.makeMany(getPostCommentHandlerMiddlewares)
  const sharedErrorHandler = errorHandlerFactory.make('sharedErrorHandler')

  return withLogging(
    withErrorHandling(withMiddleware(middlewares, getPostCommentHandler()), sharedErrorHandler),
    logger,
    'Handler',
    'getCommentHandler',
  )
}
