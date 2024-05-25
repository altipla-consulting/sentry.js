import * as Sentry from '@sentry/node'
import { TRPCError } from '@trpc/server'
import { getHTTPStatusCodeFromError } from '@trpc/server/http'
import { logger } from '@altipla/logging'
import type { MiddlewareHandler } from 'astro'
import type { ErrorRequestHandler } from 'express'

// @ts-expect-error Remove problematic Sentry imports interceptor.
globalThis._sentryEsmLoaderHookRegistered = true

if (process.env.SENTRY_DSN) {
  Sentry.init({
    dsn: process.env.SENTRY_DSN,
    release: process.env.VERSION,
    integrations: [Sentry.linkedErrorsIntegration()],
  })
}

let sentryHandler = Sentry.expressErrorHandler({
  shouldHandleError(error) {
    return !shouldSilenceError(error)
  },
})
export function expressErrorHandler(): ErrorRequestHandler {
  return function (error, req, res, next) {
    error = prepareError(error)
    sentryHandler(error, req, res, next)
    next(error)
  }
}

export function trpcOnError({ error }: { error: Error }) {
  captureError(prepareError(error))
}

export const astroMiddleware: MiddlewareHandler = ({ request, rewrite }, next) => {
  return Sentry.withIsolationScope(async () => {
    let scope = Sentry.getCurrentScope()
    scope.setSDKProcessingMetadata({ request })

    try {
      return await next()
    } catch (err) {
      if (err instanceof Response) {
        logger.warn({
          message: 'error page',
          status: err.status,
          content: await err.text(),
        })
        return err
      }

      reportError(prepareError(err))
      return rewrite('/500')
    }
  })
}

function shouldSilenceError(error: Error): boolean {
  if (error instanceof TRPCError) {
    let code = getHTTPStatusCodeFromError(error)
    if (code === 404) {
      return true
    }
  }

  return false
}

function prepareError(error: unknown): Error {
  let err: Error
  if (error instanceof Error) {
    err = error
  } else if (typeof error === 'string') {
    err = new Error(error)
  } else {
    err = new Error(JSON.stringify(error))
  }

  if (shouldSilenceError(err)) {
    let it: any = err
    logger.warn(it)
    while (it.cause) {
      it = it.cause
      logger.warn(it)
    }
  } else {
    let it: any = err
    logger.error(it)
    while (it.cause) {
      it = it.cause
      logger.error(it)
    }
  }

  return err
}

function captureError(error: Error) {
  if (process.env.SENTRY_DSN && !shouldSilenceError(error)) {
    logger.info({
      msg: 'Sentry error captured',
      id: Sentry.captureException(error),
    })
  }
}
