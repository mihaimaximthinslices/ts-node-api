import { CreateUserUsecase } from '../../../domain/usecases'
import { RouteHandlerConstructor } from '../middlewares'
import { Request, Response } from 'express'
import { InvalidInputError } from '../../../domain/errors'
import { registrationSchema } from '../../shared/validationSchemas'

type Params = {
  usecase: CreateUserUsecase
}

export const postUserHandler: RouteHandlerConstructor<Params> =
  (params: Params) => async (req: Request, res: Response) => {
    const { usecase } = params

    if (req.session.user) {
      throw new InvalidInputError('You cannot create an account if you are logged in')
    }

    const { email, password, username } = registrationSchema.parse(req.body)

    const response = await usecase({
      email,
      password,
      username,
    })

    return res.status(200).json(response)
  }
