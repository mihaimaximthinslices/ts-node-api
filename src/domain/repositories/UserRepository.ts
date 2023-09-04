import { Contract } from '../shared'
import { User } from '../entities/User'

export type UserRepository = Contract<{
  getByName: (id: string) => User | null
  getByEmail: (id: string) => Promise<User | null>
}>
