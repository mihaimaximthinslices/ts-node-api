import { Request, Response } from 'express'
import { RouteHandlerConstructor } from './types'
import { CreatePermissionContextUsecase } from '../../../domain/usecases/createPermissionContext'

type Params = {
  usecase: CreatePermissionContextUsecase
}

export const addPermissionContextMiddleware: RouteHandlerConstructor<Params> =
  (params: Params) => async (req: Request, _res: Response) => {
    const { usecase } = params

    req.permissionContext = await usecase()
  }
