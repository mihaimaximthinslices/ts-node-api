import { UseCase, UseCaseConstructor } from '../shared'
import { User } from '../entities'
import { UserRepository } from '../repositories'
import { EntityNotFound } from '../errors/errors'

type Params = {
  userRepository: UserRepository
}

type Request = {
  email: string
}

export type ValidateUserUsecase = UseCase<Request, User>

export const validateUserUsecase: UseCaseConstructor<Params, Request, User> = (params) => {
  const { userRepository } = params
  return async (request) => {
    const { email } = request

    const user = await userRepository.getByEmail(email)

    if (!user) {
      throw new EntityNotFound('User')
    }

    return user
  }
}
