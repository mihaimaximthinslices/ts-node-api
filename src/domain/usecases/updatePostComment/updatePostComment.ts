import { Post, PostComment, User } from '../../entities'
import { UseCase, UseCaseConstructor } from '../../shared'
import { PostCommentRepository, PostRepository } from '../../repositories'
import { EntityNotFoundError, UnauthorizedError } from '../../errors'
import { PostMemberRepository } from '../../repositories/PostMemberRepository'

type Params = {
  postRepository: PostRepository
  postMemberRepository: PostMemberRepository
  postCommentRepository: PostCommentRepository
}

type Request = {
  user: User
  postId: string
  commentId: string
  text: string
}

export type UpdatePostCommentUsecase = UseCase<Request, void>
export const updatePostCommentUsecase: UseCaseConstructor<Params, Request, void> = (params) => {
  const { postRepository, postMemberRepository, postCommentRepository } = params
  return async (request) => {
    const { postId, user, commentId, text } = request

    const post = await getPost(postId)

    await validatePostMembership(user, post)

    const postComment = await getPostComment(commentId)

    await validatePostComment(user, postComment)

    postComment.text = text

    await postCommentRepository.save(postComment)
  }

  async function getPost(postId: string) {
    const post = await postRepository.getById(postId)
    if (!post) {
      throw new EntityNotFoundError('Post', postId)
    }
    return post
  }

  async function validatePostMembership(user: User, post: Post) {
    const postMembers = await postMemberRepository.getByPostId(post.id)

    const member = postMembers.find((member) => member.userId === user.id)

    if (!member) {
      throw new UnauthorizedError('User')
    }
  }

  async function getPostComment(commentId: string) {
    const postComment = await postCommentRepository.getById(commentId)

    if (!postComment) {
      throw new EntityNotFoundError('PostComment', commentId)
    }

    return postComment
  }

  async function validatePostComment(user: User, comment: PostComment) {
    if (user.id !== comment.userId) {
      throw new UnauthorizedError('User')
    }
  }
}
