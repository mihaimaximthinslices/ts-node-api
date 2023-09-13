import { withLogging } from '../../../../domain/shared'
import { withMiddleware } from '../../middlewares'
import { MakeHandlerParams } from './makeRequestHandlerFactory'
import { withErrorHandling } from '../errorHandlers'
import { removePostCommentUsecase } from '../../../../domain/usecases/removePostComment'
import { deletePostCommentHandler, deletePostCommentHandlerMiddlewares } from '../../handlers/deletePostCommentHandler'

export async function makeDeletePostCommentHandler(params?: MakeHandlerParams) {
  const { middlewareFactory, errorHandlerFactory, logger, repositoryFactory } = params!

  const middlewares = middlewareFactory.makeMany(deletePostCommentHandlerMiddlewares)

  const sharedErrorHandler = errorHandlerFactory.make('sharedErrorHandler')

  const postCommentRepositoryWithLogging = withLogging(
    repositoryFactory.makePostCommentRepository(),
    logger,
    'Repository',
    'PostCommentRepository',
  )

  const usecase = removePostCommentUsecase({
    postCommentRepository: postCommentRepositoryWithLogging,
  })

  return withLogging(
    withErrorHandling(
      withMiddleware(
        middlewares,
        deletePostCommentHandler({
          usecase,
        }),
      ),
      sharedErrorHandler,
    ),
    logger,
    'Handler',
    'deletePostCommentHandler',
  )
}
