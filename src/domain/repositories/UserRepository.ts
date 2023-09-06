import { User } from '../entities/User'

export type UserRepository = {
  getByName: (id: string) => User | null
  getByEmail: (id: string) => Promise<User | null>
}
