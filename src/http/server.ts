import fastify from 'fastify'
import cookie from '@fastify/cookie'
import websocket from '@fastify/websocket'

import { poll } from './routes/poll'
import { pollResults } from './ws/poll-results'

const app = fastify()

app.register(cookie, {
  secret: process.env.APP_KEY,
  hook: 'onRequest',
  parseOptions: {}
})

app.register(websocket)

app.register(poll)
app.register(pollResults)

const port = parseInt(process.env.PORT!) || 3333

app.listen({ port }).then(() => {
  console.log(`~ serer running on port ${port}`)
})