import { Post } from '../domain/entities'
import { PostRepository } from '../domain/repositories'

const Posts: Post[] = [
  {
    userId: 2,
    title: 'hello',
    description: 'I am a post',
  },
  {
    userId: 1,
    title: 'whats up',
    description: 'I am another post',
  },
]
export const JSPostRepository: PostRepository = {
  getPostsByUserId(userId: number): Promise<Post[]> {
    return new Promise((resolve) => {
      resolve(Posts.filter((post) => post.userId === userId))
    })
  },
}
