import { withLogging } from '../../../../domain/shared'
import { withMiddleware } from '../../middlewares'
import { MakeHandlerParams } from './makeRequestHandlerFactory'
import { withErrorHandling } from '../errorHandlers'
import { getCommentHandler } from '../../handlers'

export async function makeGetCommentHandler(params?: MakeHandlerParams) {
  const { middlewareFactory, errorHandlerFactory, logger } = params!

  const validateUserMiddleware = middlewareFactory!.make('validateUserMiddleware')

  const getPostMiddleware = middlewareFactory!.make('getPostMiddleware')

  const getPostMemberMiddleware = middlewareFactory!.make('getPostMemberMiddleware')

  const validatePostMemberMiddleware = middlewareFactory!.make('validatePostMemberMiddleware')

  const getCommentMiddleware = middlewareFactory!.make('getCommentMiddleware')

  const sharedErrorHandler = errorHandlerFactory.make('sharedErrorHandler')

  return withLogging(
    withErrorHandling(
      withMiddleware(
        [
          validateUserMiddleware,
          getPostMiddleware,
          getPostMemberMiddleware,
          validatePostMemberMiddleware,
          getCommentMiddleware,
        ],
        getCommentHandler(),
      ),
      sharedErrorHandler,
    ),
    logger,
    'Handler',
    'getCommentHandler',
  )
}
