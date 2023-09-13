import { afterEach, vi, describe, expect, test, beforeEach } from 'vitest'
import { mock } from 'vitest-mock-extended'
import { updatePostCommentUsecase } from './updatePostComment'
import { userBuilder, postBuilder, postMemberBuilder } from '../../../main/shared/builders'
import { EntityNotFoundError, UnauthorizedError } from '../../errors'
import { PostCommentRepository, PostRepository } from '../../repositories'
import { PostMemberRepository } from '../../repositories/PostMemberRepository'
import { postCommentBuilder } from '../../../main/shared/builders/postCommentBuilder'
describe('updatePostComment', () => {
  const userId = 'userId'
  const postId = 'postId'
  const commentId = 'commentId'

  const oldText = 'this is the old text'

  const newText = 'this is the new text'

  const postRepository = mock<PostRepository>()

  const postMemberRepository = mock<PostMemberRepository>()

  const postCommentRepository = mock<PostCommentRepository>()

  const user = userBuilder.build({ id: userId })

  const usecase = updatePostCommentUsecase({
    postRepository,
    postMemberRepository,
    postCommentRepository,
  })

  afterEach(() => {
    vi.clearAllMocks()
  })
  const runningTheUsecase = async () =>
    usecase({
      user,
      postId,
      commentId,
      text: newText,
    })

  describe('given the post was not found', () => {
    beforeEach(() => {
      postRepository.getById.mockResolvedValue(null)
    })
    test('should throw EntityNotFoundError', async () => {
      await expect(runningTheUsecase).rejects.toEqual(new EntityNotFoundError('Post', postId))
      expect(postRepository.getById).toHaveBeenCalledWith(postId)
      expect(postRepository.getById).toBeCalledTimes(1)
    })
  })
  describe('given the post was found', () => {
    const post = postBuilder.build()
    beforeEach(() => {
      postRepository.getById.mockResolvedValue(post)
    })

    let postMembers = postMemberBuilder.buildMany(2, {
      postId: postId,
    })

    describe('given the user is not a member of the post', () => {
      beforeEach(() => {
        postMemberRepository.getByPostId.mockResolvedValue(postMembers)
        post.id = postId
      })
      test('should throw UnauthorizedError', async () => {
        await expect(runningTheUsecase).rejects.toEqual(new UnauthorizedError('User'))

        expect(postMemberRepository.getByPostId).toHaveBeenCalledWith(postId)
        expect(postMemberRepository.getByPostId).toBeCalledTimes(1)
      })
    })

    describe('given the user is a member of the post', () => {
      const userPostMember = postMemberBuilder.build({
        userId: userId,
        postId: postId,
      })
      beforeEach(() => {
        postMembers = [...postMembers, userPostMember]
        postMemberRepository.getByPostId.mockResolvedValue(postMembers)
        post.id = postId
      })
      describe('given the post comment does not exist', () => {
        beforeEach(() => {
          postCommentRepository.getById.mockResolvedValue(null)
        })

        test('should throw EntityNotFoundError', async () => {
          await expect(runningTheUsecase).rejects.toEqual(new EntityNotFoundError('PostComment', commentId))

          expect(postCommentRepository.getById).toHaveBeenCalledWith(commentId)
          expect(postCommentRepository.getById).toBeCalledTimes(1)
        })
      })

      describe('given the post comment exists', () => {
        const postComment = postCommentBuilder.build({
          postId: postId,
        })
        beforeEach(() => {
          postCommentRepository.getById.mockResolvedValue(postComment)
        })
        describe('given the user is not the author of the comment', () => {
          test('should throw UnauthorizedError', async () => {
            await expect(runningTheUsecase).rejects.toEqual(new UnauthorizedError('User'))
          })
        })
        describe('given the user is the author of the comment', () => {
          beforeEach(() => {
            postComment.userId = userId
            postComment.text = oldText
          })
          test('should update the text of the comment', async () => {
            await runningTheUsecase()

            expect(postCommentRepository.save).toHaveBeenCalledWith({
              ...postComment,
              text: newText,
            })
          })
        })
      })
    })
  })
})
