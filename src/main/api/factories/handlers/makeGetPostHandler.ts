import { withLogging } from '../../../../domain/shared'
import { withMiddleware } from '../../middlewares'
import { MakeHandlerParams } from './makeRequestHandlerFactory'
import { withErrorHandling } from '../errorHandlers'
import { getPostHandler } from '../../handlers/getPostHandler'

export async function makeGetPostHandler(params?: MakeHandlerParams) {
  const { middlewareFactory, errorHandlerFactory, logger } = params!

  const validateUserMiddleware = middlewareFactory!.make('validateUserMiddleware')

  const getPostMiddleware = middlewareFactory!.make('getPostMiddleware')

  const getPostMemberMiddleware = middlewareFactory!.make('getPostMemberMiddleware')

  const validatePostMemberMiddleware = middlewareFactory!.make('validatePostMemberMiddleware')

  const sharedErrorHandler = errorHandlerFactory.make('sharedErrorHandler')

  return withLogging(
    withErrorHandling(
      withMiddleware(
        [validateUserMiddleware, getPostMiddleware, getPostMemberMiddleware, validatePostMemberMiddleware],
        getPostHandler(),
      ),
      sharedErrorHandler,
    ),
    logger,
    'Handler',
    'getPostHandler',
  )
}
