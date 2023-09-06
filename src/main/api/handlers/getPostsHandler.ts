import { RouteHandlerConstructor } from '../types'
import { Request, Response } from 'express'
import { GetPostsUsecase } from '../../../domain/usecases/getPosts'
type Params = {
  usecase: GetPostsUsecase
}
export const getPostsHandler: RouteHandlerConstructor<Params> =
  (params: Params) => async (req: Request, res: Response) => {
    try {
      const { email } = req.params

      const { usecase } = params

      const response = await usecase({
        email: email as string,
      })

      res.status(200).json(response)
    } catch (err) {
      res.status(404).json({
        error: 'Email notfound',
      })
    }
  }
