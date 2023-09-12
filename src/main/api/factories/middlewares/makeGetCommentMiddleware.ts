import { withLogging } from '../../../../domain/shared'
import { getCommentUsecase } from '../../../../domain/usecases'
import { MakeMiddlewareParams } from './makeMiddlewareFactory'
import { getCommentMiddleware } from '../../middlewares/getCommentMiddleware'

export async function makeGetCommentMiddleware(params?: MakeMiddlewareParams) {
  const { logger, repositoryFactory } = params!

  const commentRepositoryWithLogging = withLogging(
    repositoryFactory.makeCommentRepository(),
    logger,
    'Repository',
    'CommentRepository',
  )

  const usecase = getCommentUsecase({
    commentRepository: commentRepositoryWithLogging,
  })

  const handler = getCommentMiddleware({
    usecase,
  })

  const decoratedMiddleware = withLogging(handler, logger, 'Middleware', 'getCommentMiddleware')

  return decoratedMiddleware
}
