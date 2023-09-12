import { AllDependencies } from '../../../../prodServer'
import { DomainEventEmitter } from '../../../../domain/events'
import { Post, User, PostComment, PostMember } from '../../../../domain/entities'
import { createPostMemberUsecase } from '../../../../domain/usecases/createPostMember'
import { withLogging } from '../../../../domain/shared'
import { getCommentsUsecase } from '../../../../domain/usecases'
import { removePostCommentUsecase } from '../../../../domain/usecases/removePostComment'
import { removePostMemberUsecase } from '../../../../domain/usecases/removePostMember'
import { DomainPermissionContext } from '../../../../domain/permissions/permissionContext'
export class ConcreteEventEmitter implements DomainEventEmitter {
  constructor(private dependencies: AllDependencies) {}
  async emitPostDeleted(permissionContext: DomainPermissionContext, user: User, post: Post, postMembers: PostMember[]) {
    console.log(`Preparing to emit 'postDeleted' event for Post ID: ${post.id}`)

    const commentRepositoryWithLogging = withLogging(
      this.dependencies.repositoryFactory.makePostCommentRepository(),
      this.dependencies.logger,
      'Repository',
      'commentRepository',
    )

    const getComments = getCommentsUsecase({
      commentRepository: commentRepositoryWithLogging,
    })

    const comments = await getComments({
      permissionContext,
      user,
      post,
      postMembers,
    })

    const postCommentRepositoryWithLogging = withLogging(
      this.dependencies.repositoryFactory.makePostCommentRepository(),
      this.dependencies.logger,
      'Repository',
      'postCommentRepository',
    )

    for (let i = 0; i < comments.length; i++) {
      const removePost = removePostCommentUsecase({
        postCommentRepository: postCommentRepositoryWithLogging,
      })

      await removePost({
        permissionContext,
        isDomainEvent: true,
        user,
        post,
        postMembers,
        comment: comments[i]!,
      })
    }

    const postMemberRepositoryWithLogging = withLogging(
      this.dependencies.repositoryFactory.makePostMemberRepository(),
      this.dependencies.logger,
      'Repository',
      'postMemberRepository',
    )

    for (let i = 0; i < postMembers.length; i++) {
      const removePostMember = removePostMemberUsecase({
        postMemberRepository: postMemberRepositoryWithLogging,
      })

      await removePostMember({
        permissionContext,
        isDomainEvent: true,
        user,
        post,
        postMembers,
        postMemberToDelete: postMembers[i]!,
      })
    }
  }

  async emitPostCreated(permissionContext: DomainPermissionContext, user: User, post: Post) {
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
    const createPostMember = createPostMemberUsecase({
      uuidGenerator: this.dependencies.uuidGenerator,
      dateGenerator: this.dependencies.dateGenerator,
      postMemberRepository: postMemberRepositoryWithLogging,
      userRepository: userRepositoryWithLogging,
    })

    await createPostMember({
      permissionContext,
      user,
      post,
      newUserEmail: user.email,
      role: 'OWNER',
    })
  }

  emitCommentCreated(_permissionContext: DomainPermissionContext, comment: PostComment): void {
    console.log(`Preparing to emit 'commentCreated' event for Comment ID: ${comment.id}`)
  }

  emitUserCreated(_permissionContext: DomainPermissionContext, user: User) {
    console.log(`Preparing to emit 'userCreated' event for User ID: ${user.id}`)
  }
}
