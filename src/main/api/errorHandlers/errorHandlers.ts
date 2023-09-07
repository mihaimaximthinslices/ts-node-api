import { Response } from 'express'
import { EntityNotFound, InvalidInputError, UnauthorizedError } from '../../../domain/errors'

export const sharedErrorHandler = (err: Error, res: Response) => {
  if (err instanceof InvalidInputError) {
    res.status(400).json({ error: err.message })
  } else if (err instanceof EntityNotFound) {
    res.status(404).json({ error: err.message })
  } else if (err instanceof UnauthorizedError) {
    res.status(401).json({ error: err.message })
  } else {
    // Handle other errors ere if needed
    res.status(500).json({ error: 'Internal server error' })
  }
}
