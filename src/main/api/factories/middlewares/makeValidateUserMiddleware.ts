import { withLogging } from '../../../../domain/shared'
import { JSUserRepository } from '../../../../repository'
import { validateUserUsecase } from '../../../../domain/usecases'
import { validateUserMiddleware } from '../../middlewares'
import { makeLogger } from '../../logger'

export async function makeValidateUserMiddleware() {
  const logger = makeLogger()

  const JSUserRepositoryWithLogging = withLogging(JSUserRepository, logger, 'Repository', 'UserRepository')

  const usecase = validateUserUsecase({
    userRepository: JSUserRepositoryWithLogging,
  })

  const handler = validateUserMiddleware({
    usecase,
  })

  const decoratedMiddleware = withLogging(handler, logger, 'Middleware', 'validateUserMiddleware')

  return decoratedMiddleware
}
