import { AllDependencies } from '../../../../prodServer'
import { DomainEventEmitter } from '../../../../domain/events'
import { Post, User, Comment, PostMember } from '../../../../domain/entities'
import { createPostMemberUsecase } from '../../../../domain/usecases/createPostMember'
import { withLogging } from '../../../../domain/shared'
import { getCommentsUsecase } from '../../../../domain/usecases'
export class ConcreteEventEmitter implements DomainEventEmitter {
  constructor(private dependencies: AllDependencies) {}
  async emitPostDeleted(user: User, post: Post, postMembers: PostMember[]) {
    console.log(`Preparing to emit 'postDeleted' event for Post ID: ${post.id}`)

    const commentRepositoryWithLogging = withLogging(
      this.dependencies.repositoryFactory.makeCommentRepository(),
      this.dependencies.logger,
      'Repository',
      'commentRepository',
    )

    const usecase = getCommentsUsecase({
      commentRepository: commentRepositoryWithLogging,
    })

    const comments = await usecase({
      user,
      post,
      postMembers,
    })

    console.log(comments)
  }

  async emitPostCreated(user: User, post: Post) {
    console.log(`Preparing to emit 'postCreated' event for Post ID: ${post.id}`)

    const postMemberRepositoryWithLogging = withLogging(
      this.dependencies.repositoryFactory.makePostMemberRepository(),
      this.dependencies.logger,
      'Repository',
      'postMemberRepository',
    )
    const userRepositoryWithLogging = withLogging(
      this.dependencies.repositoryFactory.makeUserRepository(),
      this.dependencies.logger,
      'Repository',
      'userRepository',
    )
    const usecase = createPostMemberUsecase({
      uuidGenerator: this.dependencies.uuidGenerator,
      dateGenerator: this.dependencies.dateGenerator,
      postMemberRepository: postMemberRepositoryWithLogging,
      userRepository: userRepositoryWithLogging,
    })

    await usecase({
      user,
      post,
      newUserEmail: user.email,
      role: 'OWNER',
    })
  }

  emitCommentCreated(comment: Comment): void {
    console.log(`Preparing to emit 'commentCreated' event for Comment ID: ${comment.id}`)
  }

  emitUserCreated(user: User) {
    console.log(`Preparing to emit 'userCreated' event for User ID: ${user.id}`)
  }
}
