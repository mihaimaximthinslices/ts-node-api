import { withLogging } from '../../../../domain/shared'
import { getCommentsUsecase } from '../../../../domain/usecases'
import { getPostCommentsHandler } from '../../handlers'
import { withMiddleware } from '../../middlewares'
import { MakeHandlerParams } from './makeRequestHandlerFactory'
import { withErrorHandling } from '../errorHandlers'

export async function makeGetPostCommentsHandler(params?: MakeHandlerParams) {
  const { middlewareFactory, errorHandlerFactory, logger, repositoryFactory } = params!

  const CommentRepository = repositoryFactory.makePostCommentRepository()

  const CommentRepositoryWithLogging = withLogging(CommentRepository, logger, 'Repository', 'CommentRepository')

  const usecase = getCommentsUsecase({
    commentRepository: CommentRepositoryWithLogging,
  })

  const middlewares = middlewareFactory.makeMany([
    'addPermissionContextMiddleware',
    'validateUserMiddleware',
    'getPostMiddleware',
    'getPostMemberMiddleware',
    'validatePostMemberMiddleware',
  ])

  const sharedErrorHandler = errorHandlerFactory.make('sharedErrorHandler')

  return withLogging(
    withErrorHandling(
      withMiddleware(
        middlewares,
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
