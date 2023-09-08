import { PostRepository, UserRepository } from '../../../../domain/repositories'

export interface RepositoryFactory {
  makePostRepository: () => PostRepository
  makeUserRepository: () => UserRepository
}
