import { MakeHandlerParams } from './makeRequestHandlerFactory'
import { withLogging } from '../../../../domain/shared'
import { withErrorHandling } from '../errorHandlers'
import { withMiddleware } from '../../middlewares'
import { createCommentUsecase } from '../../../../domain/usecases/createPostComment'
import { postPostCommentHandler } from '../../handlers/postPostCommentHandler'

export async function makePostCommentHandler(params?: MakeHandlerParams) {
  const {
    errorHandlerFactory,
    logger,
    uuidGenerator,
    dateGenerator,
    domainEventEmitter,
    repositoryFactory,
    middlewareFactory,
  } = params!

  const commentRepositoryWithLogging = withLogging(
    repositoryFactory.makePostCommentRepository(),
    logger,
    'Repository',
    'CommentRepository',
  )

  const sharedErrorHandler = errorHandlerFactory.make('sharedErrorHandler')

  const addPermissionContextMiddleware = middlewareFactory!.make('addPermissionContextMiddleware')

  const validateUserMiddleware = middlewareFactory!.make('validateUserMiddleware')

  const getPostMiddleware = middlewareFactory!.make('getPostMiddleware')

  const getPostMemberMiddleware = middlewareFactory!.make('getPostMemberMiddleware')

  const validatePostMemberMiddleware = middlewareFactory!.make('validatePostMemberMiddleware')

  const usecase = createCommentUsecase({
    uuidGenerator,
    dateGenerator,
    domainEventEmitter: domainEventEmitter,
    postCommentRepository: commentRepositoryWithLogging,
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
        ],
        postPostCommentHandler({
          usecase,
        }),
      ),
      sharedErrorHandler,
    ),
    logger,
    'Handler',
    'postCommentHandler',
  )
}
