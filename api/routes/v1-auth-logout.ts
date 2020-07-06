import { sql } from 'slonik'
import { GET } from 'sstack'

import { core } from '@/api/middleware/core'
import { connection } from '@/api/connection.ts'

const { NODE_ENV } = process.env
const PROD = NODE_ENV === 'production'

export const handler = core(
  GET(async event => {
    const { sstack_session_id, sstack_device_id } = event.cookies

    await connection.query(
      sql`
        update sessions
        set
          expires_at = now()
        where
          id = ${sstack_session_id}
          and device_id = ${sstack_device_id};
      `
    )

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
