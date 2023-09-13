import { Request, Response } from 'express'
import { ValidateUserUsecase } from '../../../domain/usecases'
import { RouteHandlerConstructor } from '../middlewares'
import { InvalidInputError } from '../../../domain/errors'

type Params = {
  usecase: ValidateUserUsecase
}
export const loginHandlerMiddlewares = ['addPermissionContextMiddleware']

export const loginHandler: RouteHandlerConstructor<Params> =
  (params: Params) => async (req: Request, res: Response) => {
    const { usecase } = params

    if (req.session.user) {
      throw new InvalidInputError('You are already logged in')
    }

    const { email, password } = req.body

    if (!email || !password) {
      throw new InvalidInputError('Email and Password are required')
    }

    const user = await usecase({
      email: email as string,
      password: password as string,
    })

    req.session.user = user

    return res.status(200).json({
      message: 'You are now logged in',
    })
  }
