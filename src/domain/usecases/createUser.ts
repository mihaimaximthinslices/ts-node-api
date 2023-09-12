import { UseCase, UseCaseConstructor, UuidGenerator, DateGenerator, HashMethods } from '../shared'
import { User } from '../entities'
import { DuplicateEntityError } from '../errors'
import { UserRepository } from '../repositories'
import { DomainEventEmitter } from '../events'
import { DomainPermissionContext } from '../permissions/permissionContext'

type Params = {
  userRepository: UserRepository
  uuidGenerator: UuidGenerator
  dateGenerator: DateGenerator
  hashMethods: HashMethods
  domainEventEmitter: DomainEventEmitter
}

type Request = {
  permissionContext: DomainPermissionContext
  email: string
  username: string
  password: string
}

export type CreateUserUsecase = UseCase<Request, void>
export const createUserUsecase: UseCaseConstructor<Params, Request, void> = (params) => {
  const { userRepository, uuidGenerator, dateGenerator, hashMethods, domainEventEmitter } = params
  return async (request) => {
    const { email, password, username, permissionContext } = request

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

    domainEventEmitter.emitUserCreated(permissionContext, newUser)
  }
}
