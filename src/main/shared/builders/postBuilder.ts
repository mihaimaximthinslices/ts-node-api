import { Post } from '../../../domain/entities'
import { faker } from '@faker-js/faker'
export const postBuilder = {
  build: (partialPost?: Partial<Post>) => {
    let newPost: Post = {
      userId: faker.string.uuid(),
      id: faker.string.uuid(),
      title: faker.lorem.lines(1),
      description: faker.lorem.lines(2),
      createdAt: new Date(),
      updatedAt: new Date(),
    }

    if (partialPost) {
      newPost = {
        ...newPost,
        ...partialPost,
      }
    }
    return newPost
  },
  buildMany: (count: number, partialPost?: Partial<Post>) => {
    const posts: Post[] = []
    for (let i = 0; i < count; i++) {
      let newPost: Post = {
        userId: faker.string.uuid(),
        id: faker.string.uuid(),
        title: faker.lorem.lines(1),
        description: faker.lorem.lines(2),
        createdAt: new Date(),
        updatedAt: new Date(),
      }
      if (partialPost) {
        newPost = {
          ...newPost,
          ...partialPost,
        }
      }
      posts.push(newPost)
    }
    return posts
  },
}
