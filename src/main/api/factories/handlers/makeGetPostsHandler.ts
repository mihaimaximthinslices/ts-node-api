import { withLogging } from '../../../../domain/shared'
import { JSPostRepository } from '../../../../repository'
import { getPostsUsecase } from '../../../../domain/usecases'
import { getPostsHandler } from '../../handlers'
import { makeLogger } from '../../logger'
import { withErrorHandling } from '../../errorHandlers'
import { withMiddleware } from '../../middlewares'
import { MakeHandlerParams } from './makeRequestHandlerFactory'

export async function makeGetPostsHandler(params?: MakeHandlerParams) {
  const logger = makeLogger()

  const JSPostRepositoryWithLogging = withLogging(JSPostRepository, logger, 'Repository', 'PostRepository')

  const usecase = getPostsUsecase({
    postRepository: JSPostRepositoryWithLogging,
  })

  const { middlewareFactory, errorHandlerFactory } = params!

  const validateUserMiddleware = middlewareFactory!.make('validateUserMiddleware')

  const sharedErrorHandler = errorHandlerFactory.make('sharedErrorHandler')

  return withLogging(
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
}
