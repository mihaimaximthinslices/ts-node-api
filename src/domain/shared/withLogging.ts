import { Contract } from './contract'
import { Logger } from './logger'

class ContractWithLogging<T> {
  constructor(
    private contract: Contract<T>,
    private logger: Logger,
    private contractName: string,
  ) {}

  protected wrapMethod<K extends keyof T>(
    methodName: K,
    method: T[K],
  ): (...args: unknown[]) => Promise<unknown | void> {
    return (...args: unknown[]) => {
      this.logger.info(`Invoking ${this.contractName}.${methodName as string} with ${JSON.stringify(args, null, 2)}`)
      const result = (method as (...args: unknown[]) => Promise<unknown | void>)(...args)
      if (result instanceof Promise) {
        return result
          .then((data) => {
            this.logger.info(
              `${this.contractName}.${methodName as string} returned successfully with response ${JSON.stringify(
                data,
                null,
                2,
              )}`,
            )
            return data
          })
          .catch((error) => {
            this.logger.error(`${this.contractName}.${methodName as string} failed: ${error}`)
            throw error
          })
      } else {
        this.logger.info(
          `${this.contractName}.${methodName as string} returned successfully with response ${JSON.stringify(
            result,
            null,
            2,
          )}`,
        )
        return result
      }
    }
  }

  getContractWithLogging(): T {
    const contract = this.contract
    const wrappedContract: Record<string, unknown> = {}
    for (const key in contract) {
      if (typeof this.contract[key] === 'function') {
        wrappedContract[key as string] = this.wrapMethod(key, this.contract[key] as T[keyof T])
      }
    }
    return wrappedContract as T
  }
}

export function withLogging<T>(repository: Contract<T>, logger: Logger, contractName: string): T {
  const contractWithLogging = new ContractWithLogging(repository, logger, contractName)
  return contractWithLogging.getContractWithLogging()
}
