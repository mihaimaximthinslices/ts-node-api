import { UseCase, UseCaseConstructor, UuidGenerator, DateGenerator } from '../shared'
import { PostRole, User } from '../entities'
import { Post, PostMember } from '../entities'
import { PostMemberRepository } from '../repositories/PostMemberRepository'
import { permissionService } from '../permissions/permissionService'
import { UserRepository } from '../repositories'
import { EntityNotFound } from '../errors'
type Params = {
  uuidGenerator: UuidGenerator
  dateGenerator: DateGenerator
  postMemberRepository: PostMemberRepository
  userRepository: UserRepository
}

type Request = {
  user: User
  post: Post
  newUserEmail: string
  role: PostRole
}

export type CreatePostMemberUsecase = UseCase<Request, PostMember>
export const createPostMemberUsecase: UseCaseConstructor<Params, Request, PostMember> = (params) => {
  const { uuidGenerator, dateGenerator, postMemberRepository, userRepository } = params
  return async (request) => {
    const { user, post, role, newUserEmail } = request

    const newUser = await getUser(newUserEmail)

    const id = uuidGenerator.next()
    const NOW = dateGenerator.now()

    const postMembers = await postMemberRepository.getByPostId(post.id)

    const newMember: PostMember = {
      id,
      postId: post.id,
      userId: user.id,
      role: role,
      createdAt: NOW,
      updatedAt: NOW,
    }

    permissionService.canAddPostMember(user, post, postMembers, newMember, newUser)

    await postMemberRepository.save(newMember)

    return newMember
  }

  async function getUser(email: string) {
    const user = await userRepository.getByEmail(email)

    if (!user) {
      throw new EntityNotFound('User', email)
    }

    return user
  }
}
