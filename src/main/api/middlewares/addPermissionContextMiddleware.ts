import { RouteHandlerConstructor } from './types'
import { CreatePermissionContextUsecase } from '../../../domain/usecases/createPermissionContext'
import { IRequest } from '../../../domain/handlers/request'
import { IResponse } from '../../../domain/handlers/response'

type Params = {
  usecase: CreatePermissionContextUsecase
}

export const addPermissionContextMiddleware: RouteHandlerConstructor<Params> =
  (params: Params) => async (req: IRequest, _res: IResponse) => {
    const { usecase } = params

    const requestContextStore = req.getRequestContextStore()

    requestContextStore.permissionContext = await usecase()

    req.setRequestContextStore(requestContextStore)
  }
