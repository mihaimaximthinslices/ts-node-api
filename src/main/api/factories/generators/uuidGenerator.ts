import crypto from 'crypto'
import { UuidGenerator } from '../../../../domain/shared'

export const makeUuidGenerator = (): UuidGenerator => {
  return {
    next: () => crypto.randomUUID(),
  }
}
