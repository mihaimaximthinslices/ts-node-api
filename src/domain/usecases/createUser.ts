import { UseCase, UseCaseConstructor, UuidGenerator, DateGenerator, HashMethods } from '../shared'
import { User } from '../entities'
import { DuplicateEntityError } from '../errors'
import { UserRepository } from '../repositories'

type Params = {
  userRepository: UserRepository
  uuidGenerator: UuidGenerator
  dateGenerator: DateGenerator
  hashMethods: HashMethods
}

type Request = {
  email: string
  username: string
  password: string
}

export type CreateUserUsecase = UseCase<Request, void>
export const createUserUsecase: UseCaseConstructor<Params, Request, void> = (params) => {
  const { userRepository, uuidGenerator, dateGenerator, hashMethods } = params
  return async (request) => {
    const { email, password, username } = request

    const id = uuidGenerator.next()
    const NOW = dateGenerator.now()

    const user = await userRepository.getByEmail(email)

    if (user) {
      throw new DuplicateEntityError(`User with email ${user.email}`)
    }

    const hashedPassword = await hashMethods.hash(password)

    const newUser: User = {
      id,
      email,
      username,
      password: hashedPassword,
      createdAt: NOW,
      updatedAt: NOW,
    }

    await userRepository.save(newUser)
  }
}
