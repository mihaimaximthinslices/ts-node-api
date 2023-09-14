import { RouteHandlerConstructor } from '../middlewares'
import { createPostMemberSchema } from '../../shared/validationSchemas'
import { CreatePostMemberUsecase } from '../../../domain/usecases/createPostMember'
import { IRequest } from '../../../domain/handlers/request'
import { IResponse } from '../../../domain/handlers/response'

type Params = {
  usecase: CreatePostMemberUsecase
}

export const postPostMemberHandlerMiddlewares = [
  'addPermissionContextMiddleware',
  'validateUserMiddleware',
  'getPostMiddleware',
  'getPostMembersMiddleware',
  'checkPostMembershipMiddleware',
]

export const postPostMemberHandler: RouteHandlerConstructor<Params> =
  (params: Params) => async (req: IRequest, res: IResponse) => {
    const { usecase } = params

    const { email } = createPostMemberSchema.parse(req.getBody())

    const { permissionContext, validateUserMiddlewareResponse, getPostMiddlewareResponse } =
      req.getRequestContextStore()

    const response = await usecase({
      permissionContext: permissionContext!,
      user: validateUserMiddlewareResponse!.user,
      post: getPostMiddlewareResponse!.post,
      role: 'GUEST',
      newUserEmail: email,
    })

    return res.sendJsonResponse(201, response)
  }
