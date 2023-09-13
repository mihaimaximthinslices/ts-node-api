import { withLogging } from '../../../../domain/shared'
import { withMiddleware } from '../../middlewares'
import { MakeHandlerParams } from './makeRequestHandlerFactory'
import { withErrorHandling } from '../errorHandlers'
import { deletePostHandler, deletePostHandlerMiddlewares } from '../../handlers/deletePostHandler'
import { removePostUsecase } from '../../../../domain/usecases/removePost'

export async function makeDeletePostHandler(params?: MakeHandlerParams) {
  const { middlewareFactory, errorHandlerFactory, logger, repositoryFactory, domainEventEmitter } = params!

  const middlewares = middlewareFactory.makeMany(deletePostHandlerMiddlewares)

  const sharedErrorHandler = errorHandlerFactory.make('sharedErrorHandler')

  const postRepositoryWithLogging = withLogging(
    repositoryFactory.makePostRepository(),
    logger,
    'Repository',
    'PostRepository',
  )

  const usecase = removePostUsecase({
    postRepository: postRepositoryWithLogging,
    domainEventEmitter: domainEventEmitter,
  })

  return withLogging(
    withErrorHandling(
      withMiddleware(
        middlewares,
        deletePostHandler({
          usecase,
        }),
      ),
      sharedErrorHandler,
    ),
    logger,
    'Handler',
    'deletePostHandler',
  )
}
