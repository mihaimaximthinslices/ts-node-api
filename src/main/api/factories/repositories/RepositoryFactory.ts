import { PostCommentRepository, PostRepository, UserRepository } from '../../../../domain/repositories'
import { PostMemberRepository } from '../../../../domain/repositories/PostMemberRepository'

export interface RepositoryFactory {
  makePostRepository: () => PostRepository
  makeUserRepository: () => UserRepository
  makePostCommentRepository: () => PostCommentRepository
  makePostMemberRepository: () => PostMemberRepository
}
