import { UseCase, UseCaseConstructor, Logger } from '../shared'
import { DomainPermissionContext, PermissionContext } from '../permissions/permissionContext'

type Params = {
  logger: Logger
}

type Request = void

export type CreatePermissionContextUsecase = UseCase<Request, DomainPermissionContext>
export const createPermissionContextUsecase: UseCaseConstructor<Params, Request, DomainPermissionContext> = (
  params,
) => {
  const { logger } = params
  return async (_request) => {
    const permissionContext = new PermissionContext(logger)

    return permissionContext
  }
}
