import { withLogging } from '../../../../domain/shared'
import { JSPostRepository } from '../../../../repository'
import { getPostsUsecase } from '../../../../domain/usecases'
import { getPostsHandler } from '../../handlers'
import { makeLogger } from '../../logger/consoleLogger'

export async function makeGetPostsHandler() {
  const logger = makeLogger()
  const JSPostRepositoryWithLogging = withLogging(JSPostRepository, logger, 'Repository', 'PostRepository')

  const usecase = getPostsUsecase({
    postRepository: JSPostRepositoryWithLogging,
  })

  const handler = getPostsHandler({
    usecase,
  })

  const decoratedHandler = withLogging(handler, logger, 'Handler', 'getPostsHandler')

  return decoratedHandler
}
