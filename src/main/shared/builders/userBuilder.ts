import { User } from '../../../domain/entities'
import { faker } from '@faker-js/faker'
export const userBuilder = {
  build: (partialUser?: Partial<User>) => {
    let newUser: User = {
      username: faker.person.firstName(),
      password: faker.string.uuid(),
      id: faker.string.uuid(),
      email: faker.internet.email(),
      createdAt: new Date(),
      updatedAt: new Date(),
    }

    if (partialUser) {
      newUser = {
        ...newUser,
        ...partialUser,
      }
    }
    return newUser
  },
  buildMany: (count: number, partialUser?: Partial<User>) => {
    const users: User[] = []
    for (let i = 0; i < count; i++) {
      let newUser: User = {
        username: faker.person.firstName(),
        password: faker.string.uuid(),
        id: faker.string.uuid(),
        email: faker.internet.email(),
        createdAt: new Date(),
        updatedAt: new Date(),
      }

      if (partialUser) {
        newUser = {
          ...newUser,
          ...partialUser,
        }
      }
      users.push(newUser)
    }
    return users
  },
}
