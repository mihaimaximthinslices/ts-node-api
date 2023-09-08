import { withLogging } from '../../../../domain/shared'
import { JSPostRepository } from '../../../../repository'
import { getPostsUsecase } from '../../../../domain/usecases'
import { getPostsHandler } from '../../handlers'
import { makeLogger } from '../../logger'
import { sharedErrorHandler, withErrorHandling } from '../../errorHandlers'
import { useValidateUserMiddleware, withMiddleware } from '../../middlewares'

export async function makeGetPostsHandler() {
  const logger = makeLogger()

  const JSPostRepositoryWithLogging = withLogging(JSPostRepository, logger, 'Repository', 'PostRepository')

  const usecase = getPostsUsecase({
    postRepository: JSPostRepositoryWithLogging,
  })

  const decoratedHandler = withLogging(
    withErrorHandling(
      withMiddleware(
        [useValidateUserMiddleware],
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
