import { Post } from '../entities/Post'

export type PostRepository = {
  getPostsByUserId: (userId: string) => Promise<Post[]>
  getById: (id: string) => Promise<Post | null>
  save: (post: Post) => Promise<void>
  delete: (post: Post) => Promise<void>
}
