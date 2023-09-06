import { withLogging } from '../../../../domain/shared'
import { JSUserRepository } from '../../../../repository/JSUserRepository'
import { logger } from '../../../logger/consoleLogger'
import { JSPostRepository } from '../../../../repository/JSPostRepository'
import { getPostsUsecase } from '../../../../domain/usecases/getPosts'
import { getPostsHandler } from '../../handlers'

export async function makeGetPostsHandler() {
  const JSUserRepositoryWithLogging = withLogging(JSUserRepository, logger, 'Repository', 'UserRepository')
  const JSPostRepositoryWithLogging = withLogging(JSPostRepository, logger, 'Repository', 'PostRepository')

  const usecase = getPostsUsecase({
    postRepository: JSPostRepositoryWithLogging,
    userRepository: JSUserRepositoryWithLogging,
  })

  const handler = getPostsHandler({
    usecase,
  })

  const decoratedHandler = withLogging(handler, logger, 'Handler', 'getPostsHandler')

  return decoratedHandler
}
