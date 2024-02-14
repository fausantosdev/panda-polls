import { FastifyInstance } from 'fastify'
import z from 'zod'

import { voting } from '../../utils/voting-pub-sub'

export async function pollResults(app: FastifyInstance) {
  app.get('/polls/:id/results', { websocket: true }, (connection, request) => {
    // Inscrever apenas nas mensagens publicadas no canal com o ID da enquete ('id')
    const schema = z.object({
      id: z.string().uuid()
    })

    const { id } = schema.parse(request.params)

    voting.subscribe(id, (message) => {
      connection.socket.send(JSON.stringify(message))
    })
  })
}