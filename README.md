# sentry.js
Helper to connect Sentry to tRPC &amp; Express.


## Install

```sh
npm install @altipla/sentry
```


## Usage

### Express

```ts
import express from 'express'
import { expressRequestHandler, expressErrorHandler } from "@altipla/sentry"

let app = express()
app.use(expressRequestHandler())
(...routes)
app.use(expressErrorHandler())
```


### tRPC

```ts
import express from 'express'
import * as trpcExpress from '@trpc/server/adapters/express'
import { trpcOnError } from "@altipla/sentry"

let app = express()

app.use('/trpc', trpcExpress.createExpressMiddleware({
  router,
  context,
  onError: trpcOnError,
}))

```
