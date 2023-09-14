import { Logger } from './logger'

type WithLogging = (
  logger: Logger,
  component: string,
  handler: string,
) => <Params extends unknown[], Return>(
  func: (...args: Params) => Return | Promise<Return>,
  inputMapper?: (...args: Params) => unknown,
  outputMapper?: (args: Return) => unknown,
) => (...args: Params) => Promise<Return>

const getJSONStringifiedRequest = (response: unknown) => {
  try {
    return 'with => ' + JSON.stringify(response, null, 2)
  } catch (err) {
    return ''
  }
}

const getJSONStringifiedResponse = (response: unknown) => {
  try {
    return 'with response => ' + JSON.stringify(response, null, 2)
  } catch (err) {
    return ''
  }
}
export const withLoggingFunction: WithLogging =
  (logger, component, handler) =>
  (func) =>
  async (...args) => {
    try {
      const ignoredArgs = ['Middleware', 'Handler']
      logger.info(
        `${component} ${handler} was invoked ${ignoredArgs.includes(component) ? '' : getJSONStringifiedRequest(args)}`,
      )

      const result = await func(...args)

      logger.info(`${component} ${handler} completed ${result !== undefined ? getJSONStringifiedResponse(result) : ''}`)

      return result
    } catch (err) {
      logger.error(`${component} ${handler} failed`)
      throw err
    }
  }

export function withLogging<T>(target: T, logger: Logger, component: string, handler: string): T {
  if (typeof target === 'function') {
    return withLoggingFunction(logger, component, handler)(target as (...args: unknown[]) => unknown) as T
  } else {
    const wrappedTarget: Record<string, unknown> = {}
    for (const key in target) {
      if (typeof target[key] === 'function') {
        wrappedTarget[key as string] = withLoggingFunction(
          logger,
          handler,
          key,
        )(target[key] as (...args: unknown[]) => unknown)
      }
    }
    return wrappedTarget as T
  }
}
