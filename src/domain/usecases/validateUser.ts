import { HashMethods, UseCase, UseCaseConstructor } from '../shared'
import { User } from '../entities'
import { UserRepository } from '../repositories'
import { EntityNotFound, UnauthorizedError } from '../errors/errors'

type Params = {
  userRepository: UserRepository
  hashMethods: HashMethods
}

type Request = {
  email: string
  password?: string
}

export type ValidateUserUsecase = UseCase<Request, User>

export const validateUserUsecase: UseCaseConstructor<Params, Request, User> = (params) => {
  const { userRepository, hashMethods } = params
  return async (request) => {
    const { email, password } = request

    const user = await userRepository.getByEmail(email)

    if (!user) {
      throw new EntityNotFound('User')
    }

    if (password) {
      const match = await hashMethods.compare(password, user.password)
      if (!match) {
        throw new UnauthorizedError('User')
      }
    }

    return user
  }
}
