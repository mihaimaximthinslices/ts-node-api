export type PostRole = 'OWNER' | 'GUEST'

export interface PostMember {
  id: string
  postId: string
  userId: string
  role: PostRole
  createdAt: Date
  updatedAt: Date
}
