import { withLogging } from '../../../../domain/shared'
import { JSPostRepository } from '../../../../repository'
import { getPostsUsecase } from '../../../../domain/usecases'
import { getPostsHandler } from '../../handlers'
import { makeLogger } from '../../logger'
import { sharedErrorHandler, withErrorHandling } from '../../errorHandlers'
import { withMiddleware } from '../../middlewares'
import { MakeHandlerParams } from './requestHandlerFactory'
export async function makeGetPostsHandler(params?: MakeHandlerParams) {
  const logger = makeLogger()

  const JSPostRepositoryWithLogging = withLogging(JSPostRepository, logger, 'Repository', 'PostRepository')

  const usecase = getPostsUsecase({
    postRepository: JSPostRepositoryWithLogging,
  })

  const { middlewareFactory } = params!

  const validateUserMiddleware = middlewareFactory!.make('validateUserMiddleware')

  const decoratedHandler = withLogging(
    withErrorHandling(
      withMiddleware(
        [validateUserMiddleware],
        getPostsHandler({
          usecase,
        }),
      ),
      sharedErrorHandler,
    ),
    logger,
    'Handler',
    'getPostsHandler',
  )

  return decoratedHandler
}
