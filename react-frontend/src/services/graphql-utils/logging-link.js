import { ApolloLink, Observable } from '@apollo/client'
import { getOperationAST } from 'graphql'
import { env } from '~/env'

import { loggerMixin } from '@thesoulfresh/utils'

/**
 * Apollo link object that will log GraphQL requests.
 * @private
 */
/* istanbul ignore next: Not important to test */
export class LoggingLink extends ApolloLink {
  constructor(
    /**
     * The level at which to perform debug logging.
     */
    level = 'debug',
  ) {
    super()

    this.level = level

    // Add logging functionality
    loggerMixin(this, '[GRAPHQL]')
  }

  logOperation(operation, type, ...rest) {
    let args = [operation.operationName]

    if (operation.variables && Object.keys(operation.variables).length > 0) {
      args.push(operation.variables)
    }

    if (type) {
      args.unshift(type)
    }

    if (rest) {
      args = args.concat(rest)
    }

    this[this.level].apply(this, args)

    const source = operation.query.loc?.source?.body
    if (type === 'START' && source) {
      this[this.level].apply(this, ['QUERY', source])
    }
  }

  request(operation, forward) {
    const operationAST = getOperationAST(
      operation.query,
      operation.operationName,
    )
    const isSubscription =
      !!operationAST && operationAST.operation === 'subscription'
    if (!isSubscription) {
      console.groupCollapsed(`[GRAPHQL] ${operation?.operationName || 'Request'} 🚀`)
      this.logOperation(operation, 'START')
      console.groupEnd()
    }
    return new Observable((observer) => {
      if (isSubscription) {
        this.logOperation(operation, 'SUBSCRIBE')
      }
      const sub = forward(operation).subscribe({
        next: (result) => {
          console.groupCollapsed(
            `[GRAPHQL] ${operation?.operationName || 'Request'} End ✋`,
          )
          this.logOperation(operation, 'RESULT', env.test ? JSON.stringify(result, null, 2) : result)
          console.groupEnd()
          observer.next(result)
        },
        error: (error) => {
          this.logOperation(operation, 'ERROR', error)
          observer.error(error)
        },
        complete: observer.complete.bind(observer),
      })
      return () => {
        if (isSubscription) {
          this.logOperation(operation, 'UNSUBSCRIBE')
        }
        sub.unsubscribe()
      }
    })
  }
}
