import { PostComment } from '../../../domain/entities'
import { faker } from '@faker-js/faker'
export const postCommentBuilder = {
  build: (partialPostComment?: Partial<PostComment>) => {
    let newPostComment: PostComment = {
      userId: faker.string.uuid(),
      id: faker.string.uuid(),
      postId: faker.string.uuid(),
      text: faker.lorem.lines(2),
      createdAt: new Date(),
      updatedAt: new Date(),
    }

    if (partialPostComment) {
      newPostComment = {
        ...newPostComment,
        ...partialPostComment,
      }
    }
    return newPostComment
  },
  buildMany: (count: number, partialPostComment?: Partial<PostComment>) => {
    const postComments: PostComment[] = []
    for (let i = 0; i < count; i++) {
      let newPostComment: PostComment = {
        userId: faker.string.uuid(),
        id: faker.string.uuid(),
        postId: faker.string.uuid(),
        text: faker.lorem.lines(2),
        createdAt: new Date(),
        updatedAt: new Date(),
      }
      if (partialPostComment) {
        newPostComment = {
          ...newPostComment,
          ...partialPostComment,
        }
      }
      postComments.push(newPostComment)
    }
    return postComments
  },
}
