import { MakeHandlerParams } from './makeRequestHandlerFactory'
import { withLogging } from '../../../../domain/shared'
import { withErrorHandling } from '../errorHandlers'
import { withMiddleware } from '../../middlewares'
import { createPostMemberUsecase } from '../../../../domain/usecases/createPostMember'
import { postPostMemberHandler } from '../../handlers/postPostMemberHandler'

export async function makePostPostMemberHandler(params?: MakeHandlerParams) {
  const { errorHandlerFactory, logger, uuidGenerator, dateGenerator, repositoryFactory, middlewareFactory } = params!

  const userRepositoryWithLogging = withLogging(
    repositoryFactory.makeUserRepository(),
    logger,
    'Repository',
    'UserRepository',
  )

  const postMemberRepositoryWithLogging = withLogging(
    repositoryFactory.makePostMemberRepository(),
    logger,
    'Repository',
    'PostMemberRepository',
  )

  const sharedErrorHandler = errorHandlerFactory.make('sharedErrorHandler')

  const validateUserMiddleware = middlewareFactory!.make('validateUserMiddleware')

  const getPostMiddleware = middlewareFactory!.make('getPostMiddleware')

  const getPostMemberMiddleware = middlewareFactory!.make('getPostMemberMiddleware')

  const validatePostMemberMiddleware = middlewareFactory!.make('validatePostMemberMiddleware')

  const usecase = createPostMemberUsecase({
    uuidGenerator,
    dateGenerator,
    userRepository: userRepositoryWithLogging,
    postMemberRepository: postMemberRepositoryWithLogging,
  })

  return withLogging(
    withErrorHandling(
      withMiddleware(
        [validateUserMiddleware, getPostMiddleware, getPostMemberMiddleware, validatePostMemberMiddleware],
        postPostMemberHandler({
          usecase,
        }),
      ),
      sharedErrorHandler,
    ),
    logger,
    'Handler',
    'postPostMemberHandler',
  )
}
