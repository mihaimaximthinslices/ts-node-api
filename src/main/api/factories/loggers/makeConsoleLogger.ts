import { Logger } from '../../../../domain/shared'

const logger: Logger = {
  error(message: string): void {
    console.error(message)
  },
  info(message: string): void {
    console.info(message)
  },
}

export const makeConsoleLogger = () => logger
