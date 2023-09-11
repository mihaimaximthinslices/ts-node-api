import { withLogging } from '../../../../domain/shared'
import { validateUserUsecase } from '../../../../domain/usecases'
import { validateUserMiddleware } from '../../middlewares'
import { MakeMiddlewareParams } from './makeMiddlewareFactory'

export async function makeValidateUserMiddleware(params?: MakeMiddlewareParams) {
  const { logger, repositoryFactory, hashMethods } = params!

  const UserRepository = repositoryFactory.makeUserRepository()

  const UserRepositoryWithLogging = withLogging(UserRepository, logger, 'Repository', 'UserRepository')

  const usecase = validateUserUsecase({
    userRepository: UserRepositoryWithLogging,
    hashMethods,
  })

  const handler = validateUserMiddleware({
    usecase,
  })

  const decoratedMiddleware = withLogging(handler, logger, 'Middleware', 'validateUserMiddleware')

  return decoratedMiddleware
}
