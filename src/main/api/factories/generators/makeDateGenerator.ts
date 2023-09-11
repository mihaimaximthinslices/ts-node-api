import { DateGenerator } from '../../../../domain/shared'

export const makeDateGenerator = (): DateGenerator => {
  return {
    now: () => new Date(),
  }
}
