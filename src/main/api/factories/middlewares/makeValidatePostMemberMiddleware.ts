import { withLogging } from '../../../../domain/shared'
import { MakeMiddlewareParams } from './makeMiddlewareFactory'
import { validatePostMemberMiddleware } from '../../middlewares/validatePostMemberMiddleware'
import { validatePostMemberUsecase } from '../../../../domain/usecases/validatePostMember'

export async function makeValidatePostMemberMiddleware(params?: MakeMiddlewareParams) {
  const { logger } = params!

  const usecase = validatePostMemberUsecase()

  const handler = validatePostMemberMiddleware({
    usecase,
  })

  const decoratedMiddleware = withLogging(handler, logger, 'Middleware', 'validatePostMemberMiddleware')

  return decoratedMiddleware
}
