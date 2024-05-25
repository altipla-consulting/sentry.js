import { test } from 'vitest'
import express, { type NextFunction, type Request, type Response } from 'express'
import { expressErrorHandler } from '.'

test.runIf(process.env.SENTRY_DSN)('error handler', async () => {
  return new Promise(() => {
    let app = express()

    app.get('/error', (_req, _res) => {
      console.log('throwing error')
      throw new Error('error')
    })

    app.use(expressErrorHandler())
    app.use(function (err: Error, _req: Request, _res: Response, _next: NextFunction) {
      console.log('propagated here', err)
    })
    app.listen(45123)
  })
})
