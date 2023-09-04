import { Logger } from './domain/shared/logger'
import { UserRepository } from './domain/repositories/UserRepository'
import { User } from './domain/entities/User'
import { withLogging } from './domain/shared'
import { Post } from './domain/entities/Post'
import { PostRepository } from './domain/repositories'

const logger: Logger = {
  error(message: string): void {
    console.error(message)
  },
  info(message: string): void {
    console.info(message)
  },
}

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

const JSUserRepository: UserRepository = {
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

const JSPostRepository: PostRepository = {
  getPostsByUserId(userId: number): Promise<Post[]> {
    return new Promise((resolve) => {
      resolve(Posts.filter((post) => post.userId === userId))
    })
  },
}

const JSUserRepositoryWithLogging = withLogging(JSUserRepository, logger, 'UserRepository')
const JSPostRepositoryWithLogging = withLogging(JSPostRepository, logger, 'PostRepository')

const getPostsByEmailUsecase = async (
  userRepository: UserRepository,
  postRepository: PostRepository,
  email: string,
) => {
  const user = await userRepository.getByEmail(email)
  if (!user) {
    throw new Error('User not found')
  }
  const posts = postRepository.getPostsByUserId(user.id)

  return posts
}

getPostsByEmailUsecase(JSUserRepositoryWithLogging, JSPostRepositoryWithLogging, 'mihai.maxim@thinslices.com').then(
  (results) => {
    console.log(results)
  },
)
