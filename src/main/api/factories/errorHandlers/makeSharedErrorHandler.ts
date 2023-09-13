import { Response } from 'express'
import {
  DuplicateEntityError,
  EntityNotFoundError,
  InvalidInputError,
  UnauthorizedError,
} from '../../../../domain/errors'
import { ZodError } from 'zod'

export const makeSharedErrorHandler = (err: Error, res: Response) => {
  if (err instanceof InvalidInputError) {
    res.status(400).json({ error: err.message })
  } else if (err instanceof EntityNotFoundError) {
    res.status(404).json({ error: err.message })
  } else if (err instanceof UnauthorizedError) {
    res.status(401).json({ error: err.message })
  } else if (err instanceof DuplicateEntityError) {
    res.status(409).json({ error: err.message })
  } else if (err instanceof ZodError) {
    res.status(400).json({
      errors: err.errors,
    })
  } else {
    console.log(err)
    // Handle other errors ere if needed
    res.status(500).json({ error: 'Internal server error' })
  }
}
