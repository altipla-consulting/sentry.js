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
import { initTRPC } from '@trpc/server';
import { trpcOnError } from "@altipla/sentry"

const t = initTRPC.create()

const router = t.router({
  (...routes)
})

t.middleware((error, req, res, next) => {
  trpcOnError(error)
  next(error, req, res, next)
})

(...start server)
```
