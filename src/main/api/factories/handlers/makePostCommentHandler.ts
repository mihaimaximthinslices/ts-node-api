import { MakeHandlerParams } from './makeRequestHandlerFactory'
import { withLogging } from '../../../../domain/shared'
import { withErrorHandling } from '../errorHandlers'
import { withMiddleware } from '../../middlewares'
import { createCommentUsecase } from '../../../../domain/usecases/createComment'
import { postCommentHandler } from '../../handlers/postCommentHandler'

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
    repositoryFactory.makeCommentRepository(),
    logger,
    'Repository',
    'CommentRepository',
  )

  const sharedErrorHandler = errorHandlerFactory.make('sharedErrorHandler')

  const validateUserMiddleware = middlewareFactory!.make('validateUserMiddleware')

  const getPostMiddleware = middlewareFactory!.make('getPostMiddleware')

  const usecase = createCommentUsecase({
    uuidGenerator,
    dateGenerator,
    domainEventEmitter: domainEventEmitter,
    commentRepository: commentRepositoryWithLogging,
  })

  return withLogging(
    withErrorHandling(
      withMiddleware(
        [validateUserMiddleware, getPostMiddleware],
        postCommentHandler({
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
