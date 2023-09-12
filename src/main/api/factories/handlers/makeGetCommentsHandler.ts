import { withLogging } from '../../../../domain/shared'
import { getCommentsUsecase } from '../../../../domain/usecases'
import { getPostCommentsHandler } from '../../handlers'
import { withMiddleware } from '../../middlewares'
import { MakeHandlerParams } from './makeRequestHandlerFactory'
import { withErrorHandling } from '../errorHandlers'

export async function makeGetCommentsHandler(params?: MakeHandlerParams) {
  const { middlewareFactory, errorHandlerFactory, logger, repositoryFactory } = params!

  const CommentRepository = repositoryFactory.makePostCommentRepository()

  const CommentRepositoryWithLogging = withLogging(CommentRepository, logger, 'Repository', 'CommentRepository')

  const usecase = getCommentsUsecase({
    commentRepository: CommentRepositoryWithLogging,
  })

  const addPermissionContextMiddleware = middlewareFactory!.make('addPermissionContextMiddleware')

  const validateUserMiddleware = middlewareFactory!.make('validateUserMiddleware')

  const getPostMiddleware = middlewareFactory!.make('getPostMiddleware')

  const getPostMemberMiddleware = middlewareFactory!.make('getPostMemberMiddleware')

  const validatePostMemberMiddleware = middlewareFactory!.make('validatePostMemberMiddleware')

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
        ],
        getPostCommentsHandler({
          usecase,
        }),
      ),
      sharedErrorHandler,
    ),
    logger,
    'Handler',
    'getCommentsHandler',
  )
}
