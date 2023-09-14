import { IRequest } from './request'
import { IResponse } from './response'

export type IRequestHandler = (req: IRequest, res: IResponse) => Promise<void>
