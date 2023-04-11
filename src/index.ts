
import * as Sentry from '@sentry/node'
import { TRPCError } from '@trpc/server'
import { getHTTPStatusCodeFromError } from '@trpc/server/http'
import { type ErrorRequestHandler, type RequestHandler } from 'express'
import { logger } from '@altipla/logging'


export function expressRequestHandler(): RequestHandler {
  if (process.env.SENTRY_DSN) {
    Sentry.init({
      dsn: process.env.SENTRY_DSN,
    })
    return Sentry.Handlers.requestHandler()
  } {
    return (_req, _res, next) => next()
  }
}

export function expressErrorHandler(): ErrorRequestHandler {
  return function(error, req, res, next) {
    logger.error(error)
    Sentry.Handlers.errorHandler({
      shouldHandleError(error) {
        return !shouldSilenceError(error)
      },
    })(error, req, res, next)
    next(error)
  }
}

export function trpcOnError({ error }: { error: Error }) {
  logger.error(error)
  if (process.env.SENTRY_DSN && !shouldSilenceError(error)) {
    Sentry.captureException(error)
  }
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
