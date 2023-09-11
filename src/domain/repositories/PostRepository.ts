import { Post } from '../entities/Post'

export type PostRepository = {
  getPostsByUserId: (userId: string) => Promise<Post[]>
  save: (post: Post) => Promise<void>
  delete: (post: Post) => Promise<void>
}
