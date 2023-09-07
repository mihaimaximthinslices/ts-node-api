import { Request, Response } from 'express'
import { ValidateUserUsecase } from '../../../domain/usecases'
import { RouteHandlerConstructor } from './types'
import { InvalidInputError } from '../../../domain/errors'

type Params = {
  usecase: ValidateUserUsecase
}

export const validateUserMiddleware: RouteHandlerConstructor<Params> =
  (params: Params) => async (req: Request, _res: Response) => {
    const { email } = req.query

    if (!email) {
      throw new InvalidInputError('Email is required')
    }

    const { usecase } = params

    const user = await usecase({
      email: email as string,
    })

    req.validateUserMiddlewareResponse = {
      user,
    }
  }
