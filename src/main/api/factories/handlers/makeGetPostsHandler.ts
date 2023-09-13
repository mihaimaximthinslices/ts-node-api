import { withLogging } from '../../../../domain/shared'
import { getPostsUsecase } from '../../../../domain/usecases'
import { getPostsHandler, getPostsHandlerMiddlewares } from '../../handlers'
import { withMiddleware } from '../../middlewares'
import { MakeHandlerParams } from './makeRequestHandlerFactory'
import { withErrorHandling } from '../errorHandlers'

export async function makeGetPostsHandler(params?: MakeHandlerParams) {
  const { middlewareFactory, errorHandlerFactory, logger, repositoryFactory } = params!

  const PostRepository = repositoryFactory.makePostRepository()

  const PostRepositoryWithLogging = withLogging(PostRepository, logger, 'Repository', 'PostRepository')

  const usecase = getPostsUsecase({
    postRepository: PostRepositoryWithLogging,
  })

  const middlewares = middlewareFactory.makeMany(getPostsHandlerMiddlewares)

  const sharedErrorHandler = errorHandlerFactory.make('sharedErrorHandler')

  return withLogging(
    withErrorHandling(
      withMiddleware(
        middlewares,
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
