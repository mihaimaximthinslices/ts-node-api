import { Request, Response } from 'express'
import { ValidateUserUsecase } from '../../../domain/usecases'
import { RouteHandlerConstructor } from './types'
import { UnauthorizedError } from '../../../domain/errors'

type Params = {
  usecase: ValidateUserUsecase
}

export const validateUserMiddleware: RouteHandlerConstructor<Params> =
  (params: Params) => async (req: Request, _res: Response) => {
    const sessionUser = req.session.user

    if (!sessionUser) {
      throw new UnauthorizedError('User')
    }

    const { email } = sessionUser

    const { usecase } = params

    const user = await usecase({
      email,
    })

    req.validateUserMiddlewareResponse = {
      user,
    }
  }
