import {
  DuplicateEntityError,
  EntityNotFoundError,
  InvalidInputError,
  UnauthorizedError,
} from '../../../../domain/errors'
import { ZodError } from 'zod'
import { IResponse } from '../../../../domain/handlers/response'

export const makeSharedErrorHandler = (err: Error, res: IResponse) => {
  if (err instanceof InvalidInputError) {
    res.sendJsonResponse(400, { error: err.message })
  } else if (err instanceof EntityNotFoundError) {
    res.sendJsonResponse(404, { error: err.message })
  } else if (err instanceof UnauthorizedError) {
    res.sendJsonResponse(401, { error: err.message })
  } else if (err instanceof DuplicateEntityError) {
    res.sendJsonResponse(409, { error: err.message })
  } else if (err instanceof ZodError) {
    res.sendJsonResponse(400, {
      errors: err.errors,
    })
  } else {
    console.log(err)
    // Handle other errors ere if needed
    res.sendJsonResponse(500, { error: err.message })
  }
}
