import { MakeHandlerParams } from './makeRequestHandlerFactory'
import { withLogging } from '../../../../domain/shared'
import { withErrorHandling } from '../errorHandlers'
import { logoutHandler } from '../../handlers'

export async function makeLogoutHandler(params?: MakeHandlerParams) {
  const { errorHandlerFactory, logger } = params!

  const sharedErrorHandler = errorHandlerFactory.make('sharedErrorHandler')

  return withLogging(withErrorHandling(logoutHandler(), sharedErrorHandler), logger, 'Handler', 'logoutHandler')
}
