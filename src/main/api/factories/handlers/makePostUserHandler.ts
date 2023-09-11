import { MakeHandlerParams } from './makeRequestHandlerFactory'
import { withLogging } from '../../../../domain/shared'
import { createUserUsecase } from '../../../../domain/usecases'
import { withErrorHandling } from '../errorHandlers'
import { postUserHandler } from '../../handlers'

export async function makePostUserHandler(params?: MakeHandlerParams) {
  const {
    errorHandlerFactory,
    logger,
    repositoryFactory,
    uuidGenerator,
    dateGenerator,
    hashMethods,
    domainEventEmitter,
  } = params!

  const UserRepository = repositoryFactory.makeUserRepository()

  const UserRepositoryWithLogging = withLogging(UserRepository, logger, 'Repository', 'UserRepository')

  const sharedErrorHandler = errorHandlerFactory.make('sharedErrorHandler')

  const usecase = createUserUsecase({
    userRepository: UserRepositoryWithLogging,
    uuidGenerator,
    dateGenerator,
    hashMethods,
    domainEventEmitter,
  })

  return withLogging(
    withErrorHandling(
      postUserHandler({
        usecase,
      }),
      sharedErrorHandler,
    ),
    logger,
    'Handler',
    'postUserHandler',
  )
}
