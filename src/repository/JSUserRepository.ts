import { User } from '../domain/entities'
import { UserRepository } from '../domain/repositories'

const MockedUsers: User[] = [
  {
    id: 1,
    email: 'mihai.maxim@thinslices.com',
    name: 'Mihai Maxim',
  },
  {
    id: 2,
    email: 'codrin.maxim@gmail.com',
    name: 'Codrin Maxim',
  },
]

export const JSUserRepository: UserRepository = {
  getByEmail(email: string): Promise<User | null> {
    return new Promise((resolve) => {
      const user = MockedUsers.find((user) => user.email === email)
      if (!user) {
        resolve(null)
      }
      resolve(user as User)
    })
  },
  getByName(name: string): User | null {
    const user = MockedUsers.find((user) => user.name === name)
    if (!user) {
      return null
    }
    return user
  },
}
