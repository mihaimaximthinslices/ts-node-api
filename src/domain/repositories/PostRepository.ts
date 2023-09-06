import { Post } from '../entities/Post'

export type PostRepository = {
  getPostsByUserId: (userId: number) => Promise<Post[]>
}
