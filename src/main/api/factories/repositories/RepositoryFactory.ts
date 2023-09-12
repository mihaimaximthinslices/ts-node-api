import { CommentRepository, PostRepository, UserRepository } from '../../../../domain/repositories'
import { PostMemberRepository } from '../../../../domain/repositories/PostMemberRepository'

export interface RepositoryFactory {
  makePostRepository: () => PostRepository
  makeUserRepository: () => UserRepository
  makeCommentRepository: () => CommentRepository
  makePostMemberRepository: () => PostMemberRepository
}
