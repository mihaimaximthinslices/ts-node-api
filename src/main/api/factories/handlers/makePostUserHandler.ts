import { MakeHandlerParams } from './makeRequestHandlerFactory'
import { withLogging } from '../../../../domain/shared'
import { createUserUsecase } from '../../../../domain/usecases'
import { withErrorHandling } from '../errorHandlers'
import { postUserHandler, postUserHandlerMiddlewares } from '../../handlers'
import { withMiddleware } from '../../middlewares'

export async function makePostUserHandler(params?: MakeHandlerParams) {
  const {
    errorHandlerFactory,
    logger,
    repositoryFactory,
    uuidGenerator,
    dateGenerator,
    hashMethods,
    domainEventEmitter,
    middlewareFactory,
  } = params!

  const UserRepository = repositoryFactory.makeUserRepository()

  const UserRepositoryWithLogging = withLogging(UserRepository, logger, 'Repository', 'UserRepository')

  const sharedErrorHandler = errorHandlerFactory.make('sharedErrorHandler')

  const middlewares = middlewareFactory.makeMany(postUserHandlerMiddlewares)

  const usecase = createUserUsecase({
    userRepository: UserRepositoryWithLogging,
    uuidGenerator,
    dateGenerator,
    hashMethods,
    domainEventEmitter,
  })

  return withLogging(
    withErrorHandling(
      withMiddleware(
        middlewares,
        postUserHandler({
          usecase,
        }),
      ),
      sharedErrorHandler,
    ),
    logger,
    'Handler',
    'postUserHandler',
  )
}
