import { MakeHandlerParams } from './makeRequestHandlerFactory'
import { withLogging } from '../../../../domain/shared'
import { validateUserUsecase } from '../../../../domain/usecases'
import { withErrorHandling } from '../errorHandlers'

import { loginHandler } from '../../handlers'

export async function makeLoginHandler(params?: MakeHandlerParams) {
  const { errorHandlerFactory, logger, repositoryFactory, hashMethods } = params!

  const UserRepository = repositoryFactory.makeUserRepository()

  const UserRepositoryWithLogging = withLogging(UserRepository, logger, 'Repository', 'UserRepository')

  const sharedErrorHandler = errorHandlerFactory.make('sharedErrorHandler')

  const usecase = validateUserUsecase({
    userRepository: UserRepositoryWithLogging,
    hashMethods: hashMethods,
  })

  return withLogging(
    withErrorHandling(
      loginHandler({
        usecase,
      }),
      sharedErrorHandler,
    ),
    logger,
    'Handler',
    'loginHandler',
  )
}
