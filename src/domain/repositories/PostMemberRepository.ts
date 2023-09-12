import { PostMember } from '../entities/PostMember'

export type PostMemberRepository = {
  getByPostId: (postId: string) => Promise<PostMember[]>
  save: (postMember: PostMember) => Promise<void>
  delete: (postMemberId: string) => Promise<void>
}
