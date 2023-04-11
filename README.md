# sentry.js
Helper to connect Sentry to tRPC &amp; Express.


## Install

```sh
npm install @altipla/sentry
```


## Usage

```ts
import express from 'express'
import { expressRequestHandler, expressErrorHandler, trpcOnError } from "@altipla/sentry"

let app = express()
app.use(expressRequestHandler())
(...routes)
app.use(expressErrorHandler())
app.use('/trpc', trpcExpress.createExpressMiddleware({
    router,
    createContext,
    onError({ error }) {
      trpcOnError(error)
    },
  }))
```
