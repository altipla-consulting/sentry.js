# sentry.js

Helper to connect Sentry to tRPC, Express and Astro.

## Install

```sh
npm install @altipla/sentry
```

## Usage

### Express

Add the the error handler after all the other routes.

```ts
import express from 'express'
import { expressErrorHandler } from '@altipla/sentry'

let app = express()

app.get('/', (req, res) => {
  res.send('Hello World!')
})

// (...add more routes here...)

app.use(expressErrorHandler())
```

### tRPC

Set `onError` option when creating the tRPC routers. For example with the Express connector:

```ts
import express from 'express'
import { initTRPC } from '@trpc/server'
import * as trpcExpress from '@trpc/server/adapters/express'
import { trpcOnError } from '@altipla/sentry'

let app = express()

app.use(
  '/trpc',
  trpcExpress.createExpressMiddleware({
    router,
    context,
    onError: trpcOnError,
  }),
)
```
