import { PostMember } from '../../../domain/entities'
import { faker } from '@faker-js/faker'
export const postMemberBuilder = {
  build: (partialPostMember?: Partial<PostMember>) => {
    let newPostMember: PostMember = {
      id: faker.string.uuid(),
      userId: faker.string.uuid(),
      postId: faker.string.uuid(),
      role: 'GUEST',
      createdAt: new Date(),
      updatedAt: new Date(),
    }

    if (partialPostMember) {
      newPostMember = {
        ...newPostMember,
        ...partialPostMember,
      }
    }
    return newPostMember
  },
  buildMany: (count: number, partialPostMember?: Partial<PostMember>) => {
    const posts: PostMember[] = []
    for (let i = 0; i < count; i++) {
      let newPostMember: PostMember = {
        id: faker.string.uuid(),
        userId: faker.string.uuid(),
        postId: faker.string.uuid(),
        role: 'GUEST',
        createdAt: new Date(),
        updatedAt: new Date(),
      }
      if (partialPostMember) {
        newPostMember = {
          ...newPostMember,
          ...partialPostMember,
        }
      }
      posts.push(newPostMember)
    }
    return posts
  },
}
