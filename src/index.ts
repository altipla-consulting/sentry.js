

import * as Sentry from '@sentry/node'
import { TRPCError } from '@trpc/server'
import { getHTTPStatusCodeFromError } from '@trpc/server/http'
import { type Request, type Response, type NextFunction } from 'express'


export function expressRequestHandler() {
  if (process.env.SENTRY_DSN) {
    Sentry.init({
      dsn: process.env.SENTRY_DSN,
    })
    return Sentry.Handlers.requestHandler()
  }
}

export function expressErrorHandler() {
  return Sentry.Handlers.errorHandler({
    shouldHandleError(error) {
      return !shouldSilenceError(error)
    },
  })
}

export function trpcErrorHandler(err: Error) {
  if (process.env.SENTRY_DSN && !shouldSilenceError(err)) {
    Sentry.captureException(err)
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
