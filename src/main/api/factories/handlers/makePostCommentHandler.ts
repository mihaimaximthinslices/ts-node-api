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

  const middlewares = middlewareFactory.makeMany([
    'addPermissionContextMiddleware',
    'validateUserMiddleware',
    'getPostMiddleware',
    'getPostMemberMiddleware',
    'validatePostMemberMiddleware',
  ])

  const usecase = createCommentUsecase({
    uuidGenerator,
    dateGenerator,
    domainEventEmitter: domainEventEmitter,
    postCommentRepository: commentRepositoryWithLogging,
  })

  return withLogging(
    withErrorHandling(
      withMiddleware(
        middlewares,
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
