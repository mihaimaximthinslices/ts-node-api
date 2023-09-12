import { withLogging } from '../../../../domain/shared'
import { MakeMiddlewareParams } from './makeMiddlewareFactory'
import { addPermissionContextMiddleware } from '../../middlewares/addPermissionContextMiddleware'
import { createPermissionContextUsecase } from '../../../../domain/usecases/createPermissionContext'

export async function makeAddPermissionContextMiddleware(params?: MakeMiddlewareParams) {
  const { logger } = params!

  const usecase = createPermissionContextUsecase({
    logger,
  })

  const middleware = addPermissionContextMiddleware({
    usecase,
  })

  const decoratedMiddleware = withLogging(middleware, logger, 'Middleware', 'addPermissionContextMiddleware')

  return decoratedMiddleware
}
