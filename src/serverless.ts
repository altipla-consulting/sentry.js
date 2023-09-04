
import { TRPCError } from '@trpc/server'
import { getHTTPStatusCodeFromError } from '@trpc/server/http'
import { logger } from '@altipla/logging'
import { Toucan } from 'toucan-js'
import { config } from 'dotenv'


interface Context {
  waitUntil: (promise: Promise<unknown>) => void
}

interface ErrorContext {
  error: Error
  request: Request
  context: Context
}

config()

export function trpcOnError({ error, request, context }: ErrorContext) {
  logger.error(error)
  if (process.env.SENTRY_DSN && !shouldSilenceError(error)) {
    let sentry = new Toucan({
      dsn: process.env.SENTRY_DSN,
      context,
      request,
      requestDataOptions: {
        allowedHeaders: true,
        allowedCookies: true,
        allowedSearchParams: true,
        allowedIps: true,
      },
    })
    sentry.captureException(error)
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
