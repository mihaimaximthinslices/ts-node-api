import { RepositoryFactory } from './RepositoryFactory'
import { PostRepository, UserRepository } from '../../../../domain/repositories'
import { Post, User } from '../../../../domain/entities'

const Posts: Post[] = [
  {
    userId: 2,
    title: 'hello',
    description: 'I am a post',
  },
  {
    userId: 1,
    title: 'whats up',
    description: 'I am another post',
  },
]

const Users: User[] = [
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

export const makeJSRepositoryFactory = (): RepositoryFactory => {
  return {
    makePostRepository: (): PostRepository => {
      return {
        getPostsByUserId(userId: number): Promise<Post[]> {
          return new Promise((resolve) => {
            resolve(Posts.filter((post) => post.userId === userId))
          })
        },
      }
    },
    makeUserRepository: (): UserRepository => {
      return {
        getByEmail(email: string): Promise<User | null> {
          return new Promise((resolve) => {
            const user = Users.find((user) => user.email === email)
            if (!user) {
              resolve(null)
            }
            resolve(user as User)
          })
        },
        getByName(name: string): User | null {
          const user = Users.find((user) => user.name === name)
          if (!user) {
            return null
          }
          return user
        },
      }
    },
  }
}
