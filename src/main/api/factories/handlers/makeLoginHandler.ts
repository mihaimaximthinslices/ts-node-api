import { MakeHandlerParams } from './makeRequestHandlerFactory'
import { withLogging } from '../../../../domain/shared'
import { validateUserUsecase } from '../../../../domain/usecases'
import { withErrorHandling } from '../errorHandlers'

import { loginHandler, loginHandlerMiddlewares } from '../../handlers'
import { withMiddleware } from '../../middlewares'

export async function makeLoginHandler(params?: MakeHandlerParams) {
  const { errorHandlerFactory, logger, repositoryFactory, hashMethods, middlewareFactory } = params!

  const UserRepository = repositoryFactory.makeUserRepository()

  const UserRepositoryWithLogging = withLogging(UserRepository, logger, 'Repository', 'UserRepository')

  const sharedErrorHandler = errorHandlerFactory.make('sharedErrorHandler')

  const middlewares = middlewareFactory.makeMany(loginHandlerMiddlewares)

  const usecase = validateUserUsecase({
    userRepository: UserRepositoryWithLogging,
    hashMethods: hashMethods,
  })

  return withLogging(
    withErrorHandling(
      withMiddleware(
        middlewares,
        loginHandler({
          usecase,
        }),
      ),
      sharedErrorHandler,
    ),
    logger,
    'Handler',
    'loginHandler',
  )
}
