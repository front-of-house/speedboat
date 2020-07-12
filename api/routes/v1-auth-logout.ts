import { GET } from 'sstack'

import { core } from '@/api/middleware/core'
import { expireSessionById } from '@/db/session'

const { NODE_ENV } = process.env
const PROD = NODE_ENV === 'production'

export const handler = core(
  GET(async event => {
    const { sstack_session_id } = event.cookies

    await expireSessionById(sstack_session_id)

    return {
      statusCode: 204,
      cookies: {
        sstack_session_id: [
          'invalidated',
          PROD
            ? {
                secure: true,
                httpOnly: true,
                sameSite: 'strict',
                expires: new Date()
              }
            : {
                httpOnly: true,
                sameSite: 'strict',
                expires: new Date()
              }
        ]
      }
    }
  })
)
