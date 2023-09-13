import { withLogging } from '../../../../domain/shared'
import { MakeMiddlewareParams } from './makeMiddlewareFactory'
import { checkPostMembershipMiddleware } from '../../middlewares/checkPostMembershipMiddleware'
import { checkPostMembershipUsecase } from '../../../../domain/usecases/checkPostMember'

export async function makeCheckPostMembershipMiddleware(params?: MakeMiddlewareParams) {
  const { logger } = params!

  const usecase = checkPostMembershipUsecase()

  const handler = checkPostMembershipMiddleware({
    usecase,
  })

  const decoratedMiddleware = withLogging(handler, logger, 'Middleware', 'validatePostMemberMiddleware')

  return decoratedMiddleware
}
