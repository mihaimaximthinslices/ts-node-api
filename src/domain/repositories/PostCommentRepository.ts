import { PostComment } from '../entities'
export interface PostCommentRepository {
  getById(id: string): Promise<PostComment | null>
  getByPostId(postId: string): Promise<PostComment[]>
  save(comment: PostComment): Promise<void>
  delete(id: string): Promise<void>
}
