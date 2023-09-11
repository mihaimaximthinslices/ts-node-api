import { withLogging } from '../../../../domain/shared'
import { getPostUsecase } from '../../../../domain/usecases'
import { MakeMiddlewareParams } from './makeMiddlewareFactory'
import { getPostMiddleware } from '../../middlewares/getPostMiddleware'

export async function makeGetPostMiddleware(params?: MakeMiddlewareParams) {
  const { logger, repositoryFactory } = params!

  const postRepositoryWithLogging = withLogging(
    repositoryFactory.makePostRepository(),
    logger,
    'Repository',
    'PostRepository',
  )

  const usecase = getPostUsecase({
    postRepository: postRepositoryWithLogging,
  })

  const handler = getPostMiddleware({
    usecase,
  })

  const decoratedMiddleware = withLogging(handler, logger, 'Middleware', 'getPostMiddleware')

  return decoratedMiddleware
}
