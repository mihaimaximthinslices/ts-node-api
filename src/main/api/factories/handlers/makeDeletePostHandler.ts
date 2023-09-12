import { withLogging } from '../../../../domain/shared'
import { withMiddleware } from '../../middlewares'
import { MakeHandlerParams } from './makeRequestHandlerFactory'
import { withErrorHandling } from '../errorHandlers'
import { deletePostHandler } from '../../handlers/deletePostHandler'
import { removePostUsecase } from '../../../../domain/usecases/removePost'

export async function makeDeletePostHandler(params?: MakeHandlerParams) {
  const { middlewareFactory, errorHandlerFactory, logger, repositoryFactory, domainEventEmitter } = params!

  const addPermissionContextMiddleware = middlewareFactory!.make('addPermissionContextMiddleware')

  const validateUserMiddleware = middlewareFactory!.make('validateUserMiddleware')

  const getPostMiddleware = middlewareFactory!.make('getPostMiddleware')

  const getPostMemberMiddleware = middlewareFactory!.make('getPostMemberMiddleware')

  const validatePostMemberMiddleware = middlewareFactory!.make('validatePostMemberMiddleware')

  const sharedErrorHandler = errorHandlerFactory.make('sharedErrorHandler')

  const postRepositoryWithLogging = withLogging(
    repositoryFactory.makePostRepository(),
    logger,
    'Repository',
    'PostRepository',
  )

  const usecase = removePostUsecase({
    postRepository: postRepositoryWithLogging,
    domainEventEmitter: domainEventEmitter,
  })

  return withLogging(
    withErrorHandling(
      withMiddleware(
        [
          addPermissionContextMiddleware,
          validateUserMiddleware,
          getPostMiddleware,
          getPostMemberMiddleware,
          validatePostMemberMiddleware,
        ],
        deletePostHandler({
          usecase,
        }),
      ),
      sharedErrorHandler,
    ),
    logger,
    'Handler',
    'deletePostHandler',
  )
}
