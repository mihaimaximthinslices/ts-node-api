import { withLogging } from '../../../../domain/shared'
import { updatePostCommentUsecase } from '../../../../domain/usecases/updatePostComment'
import { patchPostCommentHandler } from '../../handlers/patchPostComment'
import { MakeHandlerParams } from './makeRequestHandlerFactory'
import { withErrorHandling } from '../errorHandlers'
import { withMiddleware } from '../../middlewares'
export async function makePatchPostCommentHandler(params?: MakeHandlerParams) {
  const { logger, repositoryFactory, errorHandlerFactory, middlewareFactory } = params!

  const middlewares = middlewareFactory.makeMany(['addPermissionContextMiddleware', 'validateUserMiddleware'])

  const postCommentRepositoryWithLogging = withLogging(
    repositoryFactory.makePostCommentRepository(),
    logger,
    'Repository',
    'PostCommentRepository',
  )
  const postRepositoryWithLogging = withLogging(
    repositoryFactory.makePostRepository(),
    logger,
    'Repository',
    'PostRepository',
  )

  const postMemberRepositoryWithLogging = withLogging(
    repositoryFactory.makePostMemberRepository(),
    logger,
    'Repository',
    'PostMemberRepository',
  )

  const usecase = updatePostCommentUsecase({
    postRepository: postRepositoryWithLogging,
    postMemberRepository: postMemberRepositoryWithLogging,
    postCommentRepository: postCommentRepositoryWithLogging,
  })

  const sharedErrorHandler = errorHandlerFactory.make('sharedErrorHandler')

  return withLogging(
    withErrorHandling(
      withMiddleware(
        middlewares,
        patchPostCommentHandler({
          usecase,
        }),
      ),
      sharedErrorHandler,
    ),
    logger,
    'Handler',
    'patchPostCommentHandler',
  )
}
