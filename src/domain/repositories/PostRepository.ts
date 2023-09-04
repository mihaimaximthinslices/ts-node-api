import { Contract } from '../shared'
import { Post } from '../entities/Post'

export type PostRepository = Contract<{
  getPostsByUserId: (userId: number) => Promise<Post[]>
}>
