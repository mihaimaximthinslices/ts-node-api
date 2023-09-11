import { User } from '../entities/User'

export type UserRepository = {
  getByEmail: (id: string) => Promise<User | null>
  save: (user: User) => Promise<void>
  delete: (user: User) => Promise<void>
}
