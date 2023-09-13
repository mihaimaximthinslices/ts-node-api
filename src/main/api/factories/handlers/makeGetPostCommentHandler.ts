import { withLogging } from '../../../../domain/shared'
import { withMiddleware } from '../../middlewares'
import { MakeHandlerParams } from './makeRequestHandlerFactory'
import { withErrorHandling } from '../errorHandlers'
import { getPostCommentHandler } from '../../handlers'

export async function makeGetPostCommentHandler(params?: MakeHandlerParams) {
  const { middlewareFactory, errorHandlerFactory, logger } = params!

  const addPermissionContextMiddleware = middlewareFactory!.make('addPermissionContextMiddleware')

  const validateUserMiddleware = middlewareFactory!.make('validateUserMiddleware')

  const getPostMiddleware = middlewareFactory!.make('getPostMiddleware')

  const getPostMemberMiddleware = middlewareFactory!.make('getPostMemberMiddleware')

  const validatePostMemberMiddleware = middlewareFactory!.make('validatePostMemberMiddleware')

  const getPostCommentMiddleware = middlewareFactory!.make('getPostCommentMiddleware')

  const sharedErrorHandler = errorHandlerFactory.make('sharedErrorHandler')

  return withLogging(
    withErrorHandling(
      withMiddleware(
        [
          addPermissionContextMiddleware,
          validateUserMiddleware,
          getPostMiddleware,
          getPostMemberMiddleware,
          validatePostMemberMiddleware,
          getPostCommentMiddleware,
        ],
        getPostCommentHandler(),
      ),
      sharedErrorHandler,
    ),
    logger,
    'Handler',
    'getCommentHandler',
  )
}
