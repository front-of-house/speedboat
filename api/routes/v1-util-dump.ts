import { GET } from 'sstack'
import { core } from '@/api/middleware/core'

export const handler = core(
  GET((event, context) => {
    return {
      statusCode: 200,
      cookies: {
        speedboat_dump: 'true'
      },
      body: {
        event,
        context
      }
    }
  })
)
