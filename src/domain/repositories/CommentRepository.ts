import { Comment } from '../entities'
export interface CommentRepository {
  getById(id: string): Promise<Comment | null>
  getByPostId(postId: string): Promise<Comment[]>
  save(comment: Comment): Promise<void>
  delete(id: string): Promise<void>
}
