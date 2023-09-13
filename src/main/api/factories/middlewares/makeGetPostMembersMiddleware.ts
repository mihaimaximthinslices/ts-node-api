import { withLogging } from '../../../../domain/shared'
import { getPostMembersMiddleware } from '../../middlewares'
import { MakeMiddlewareParams } from './makeMiddlewareFactory'
import { getPostMembers } from '../../../../domain/usecases/getPostMembers'

export async function makeGetPostMembersMiddleware(params?: MakeMiddlewareParams) {
  const { logger, repositoryFactory } = params!

  const UserRepository = repositoryFactory.makePostMemberRepository()

  const PostMemberRepositoryWithLogging = withLogging(UserRepository, logger, 'Repository', 'PostMemberRepository')

  const usecase = getPostMembers({
    postMemberRepository: PostMemberRepositoryWithLogging,
  })

  const middleware = getPostMembersMiddleware({
    usecase,
  })

  const decoratedMiddleware = withLogging(middleware, logger, 'Middleware', 'getPostMembersMiddleware')

  return decoratedMiddleware
}
