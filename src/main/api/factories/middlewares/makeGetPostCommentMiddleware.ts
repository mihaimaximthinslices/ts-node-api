import { withLogging } from '../../../../domain/shared'
import { getPostCommentUsecase } from '../../../../domain/usecases'
import { MakeMiddlewareParams } from './makeMiddlewareFactory'
import { getCommentMiddleware } from '../../middlewares/getCommentMiddleware'

export async function makeGetPostCommentMiddleware(params?: MakeMiddlewareParams) {
  const { logger, repositoryFactory } = params!

  const commentRepositoryWithLogging = withLogging(
    repositoryFactory.makePostCommentRepository(),
    logger,
    'Repository',
    'CommentRepository',
  )

  const usecase = getPostCommentUsecase({
    postCommentRepository: commentRepositoryWithLogging,
  })

  const handler = getCommentMiddleware({
    usecase,
  })

  const decoratedMiddleware = withLogging(handler, logger, 'Middleware', 'getCommentMiddleware')

  return decoratedMiddleware
}
