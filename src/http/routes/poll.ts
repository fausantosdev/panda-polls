import { FastifyInstance } from 'fastify'
import { z } from 'zod'
import { randomUUID } from 'node:crypto'

import { prisma } from '../../lib/prisma'

import { redis } from '../../lib/redis'

import { voting } from '../../utils/voting-pub-sub'

export async function poll(app: FastifyInstance) {
  app.post('/polls', async (request, reply) => {

    const schema = z.object({
      title: z.string(),
      options: z.array(z.string())
    })
  
    const { title, options } = schema.parse(request.body)
  
    const poll = await prisma.poll.create({
      data: {
        title,
        options: {
          createMany: {
            data: options.map(option => {
              return { title: option }
            })
          }
        }
      }
    })
  
    return reply.status(201).send({
      poolId: poll.id
    })
  })

  app.get('/polls/:id', async (request, reply) => {
    const schema = z.object({
      id: z.string().uuid(),
    })

    const { id } = schema.parse(request.params)

    const poll = await prisma.poll.findUnique({
      where: {
        id
      },
      include: {
        options: {
          select: {
            id: true,
            title: true
          }
        }
      }
    })

    if (!poll) {
      return reply.status(400).send({ message: 'Poll not found.' })
    }

    const result = await redis.zrange(id, 0, -1, 'WITHSCORES')

    const votes = result.reduce((obj, line, index) => {
      if (index % 2 === 0) {
        const score = result[index + 1]
        
        Object.assign(obj, { [line]: Number(score) })
      }

      return obj
    }, {} as Record<string, number>)

    return reply.send({ 
      poll: {
        id: poll.id,
        title: poll.title,
        options: poll.options.map(option => {
          return {
            id: option.id,
            title: option.title,
            score: (option.id in votes) ? votes[option.id] : 0
          }
        })
      }
    })
  })

  app.post('/polls/:id/votes', async (request, reply) => {

    const schemaPoll = z.object({
      id: z.string().uuid()
    })

    const schemaOption = z.object({
      optionId: z.string().uuid()
    })

    const { id } = schemaPoll.parse(request.params)
  
    const { optionId } = schemaOption.parse(request.body)

    let { pandaPollsSessionId } = request.cookies

    if (pandaPollsSessionId) {
      const userHasAlreadyVoted = await prisma.vote.findUnique({
        where: {
          sessionId_pollId: {
            sessionId: pandaPollsSessionId,
            pollId: id
          }
        }
      })

      if (userHasAlreadyVoted && userHasAlreadyVoted.pollOptionId !== optionId) {
        await prisma.vote.delete({
          where: {
            id: userHasAlreadyVoted.id
          }
        })

        const votes = await redis.zincrby(id, -1, userHasAlreadyVoted.pollOptionId)
      
        voting.publish(id, {
          optionId: userHasAlreadyVoted.pollOptionId,
          votes: Number(votes)
        })

      } else if (userHasAlreadyVoted) {
        return reply.status(400).send({ 
          message: 'Have you already voted in this poll.'
        })
      }
    }

    if (!pandaPollsSessionId) {
      pandaPollsSessionId = randomUUID()

      reply.setCookie('pandaPollsSessionId', pandaPollsSessionId, {
        path: '/',
        maxAge: 60 * 60 * 24 * 30, // 30 days
        signed: true,
        httpOnly: true
      })
    }

    await prisma.vote.create({
      data: {
        sessionId: pandaPollsSessionId,
        pollId: id,
        pollOptionId: optionId
      }
    })

    const votes = await redis.zincrby(id, 1, optionId)

    voting.publish(id, {
      optionId,
      votes: Number(votes)
    })

    return reply.status(201).send({ pandaPollsSessionId })
  })
}