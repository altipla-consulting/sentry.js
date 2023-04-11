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
import { expressRequestHandler, expressErrorHandler } from '@altipla/sentry'

let app = express()
app.use(expressRequestHandler())

app.get('/', (req, res) => {
  res.send('Hello World!')
})
//(...add more routes here...)

app.use(expressErrorHandler())
```


### tRPC

```ts
import express from 'express'
import { initTRPC } from '@trpc/server'
import * as trpcExpress from '@trpc/server/adapters/express'
import { trpcOnError } from "@altipla/sentry"

let app = express()
let t = initTRPC.create()

let router = t.router({
  //(...add your routes here...)
})
let context = {
  //(...add your context here...)
}

app.use('/trpc', trpcExpress.createExpressMiddleware({
  router,
  context,
  onError: trpcOnError,
}))

```
