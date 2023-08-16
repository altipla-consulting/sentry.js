# sentry.js
Helper to connect Sentry to tRPC &amp; Express.


## Install

```sh
npm install @altipla/sentry
```


## Usage

### Express

Add the request handler before any other route and the error handler at the end of all the routes.

```ts
import express from 'express'
import { expressRequestHandler, expressErrorHandler } from '@altipla/sentry'

let app = express()

app.use(expressRequestHandler())

app.get('/', (req, res) => {
  res.send('Hello World!')
})

// (...add more routes here...)

app.use(expressErrorHandler())
```


### tRPC

Set `onError` when connecting the tRPC routers. For example with the Express connector:

```ts
import express from 'express'
import { initTRPC } from '@trpc/server'
import * as trpcExpress from '@trpc/server/adapters/express'
import { trpcOnError } from '@altipla/sentry'

let app = express()

app.use('/trpc', trpcExpress.createExpressMiddleware({
  router,
  context,
  onError: trpcOnError,
}))
```
