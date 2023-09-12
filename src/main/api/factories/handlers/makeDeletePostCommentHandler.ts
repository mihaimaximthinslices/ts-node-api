import { withLogging } from '../../../../domain/shared'
import { withMiddleware } from '../../middlewares'
import { MakeHandlerParams } from './makeRequestHandlerFactory'
import { withErrorHandling } from '../errorHandlers'
import { removePostCommentUsecase } from '../../../../domain/usecases/removePostComment'
import { deletePostCommentHandler } from '../../handlers/deletePostComment'

export async function makeDeletePostCommentHandler(params?: MakeHandlerParams) {
  const { middlewareFactory, errorHandlerFactory, logger, repositoryFactory } = params!
  const addPermissionContextMiddleware = middlewareFactory!.make('addPermissionContextMiddleware')

  const validateUserMiddleware = middlewareFactory!.make('validateUserMiddleware')

  const getPostMiddleware = middlewareFactory!.make('getPostMiddleware')

  const getPostMemberMiddleware = middlewareFactory!.make('getPostMemberMiddleware')

  const validatePostMemberMiddleware = middlewareFactory!.make('validatePostMemberMiddleware')

  const getPostCommentMiddleware = middlewareFactory!.make('getPostCommentMiddleware')

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
        [
          addPermissionContextMiddleware,
          validateUserMiddleware,
          getPostMiddleware,
          getPostMemberMiddleware,
          validatePostMemberMiddleware,
          getPostCommentMiddleware,
        ],
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
