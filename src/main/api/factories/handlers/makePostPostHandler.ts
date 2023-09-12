import { MakeHandlerParams } from './makeRequestHandlerFactory'
import { withLogging } from '../../../../domain/shared'
import { createPostUsecase } from '../../../../domain/usecases'
import { withErrorHandling } from '../errorHandlers'
import { postPostHandler } from '../../handlers/postPostHandler'
import { withMiddleware } from '../../middlewares'

export async function makePostPostHandler(params?: MakeHandlerParams) {
  const {
    errorHandlerFactory,
    logger,
    uuidGenerator,
    dateGenerator,
    domainEventEmitter,
    repositoryFactory,
    middlewareFactory,
  } = params!

  const postRepositoryWithLogging = withLogging(
    repositoryFactory.makePostRepository(),
    logger,
    'Repository',
    'PostRepository',
  )

  const sharedErrorHandler = errorHandlerFactory.make('sharedErrorHandler')

  const addPermissionContextMiddleware = middlewareFactory!.make('addPermissionContextMiddleware')

  const validateUserMiddleware = middlewareFactory!.make('validateUserMiddleware')

  const usecase = createPostUsecase({
    uuidGenerator,
    dateGenerator,
    domainEventEmitter: domainEventEmitter,
    postRepository: postRepositoryWithLogging,
  })

  return withLogging(
    withErrorHandling(
      withMiddleware(
        [addPermissionContextMiddleware, validateUserMiddleware],
        postPostHandler({
          usecase,
        }),
      ),
      sharedErrorHandler,
    ),
    logger,
    'Handler',
    'postPostHandler',
  )
}
