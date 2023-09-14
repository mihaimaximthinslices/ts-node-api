import { IResponse } from '../../../../domain/handlers/response'
import { IRequest } from '../../../../domain/handlers/request'
import { IRequestHandler } from '../../../../domain/handlers/requestHandler'

export const withErrorHandling =
  (handler: IRequestHandler, errorHandler: (err: Error, res: IResponse) => void) =>
  async (req: IRequest, res: IResponse) => {
    try {
      await handler(req, res)
    } catch (err) {
      errorHandler(err as Error, res)
    }
  }
