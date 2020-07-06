import { sql } from 'slonik'
import { GET } from 'sstack'
import createError from 'http-errors'

import { core } from '@/api/middleware/core'
import { connection } from '@/api/connection.ts'

export const handler = core(
  GET(async event => {
    const { sstack_session_id, sstack_device_id } = event.cookies

    if (!sstack_session_id || !sstack_device_id) {
      throw createError(403)
      // TODO create anon session?
    }

    const { rows: sessionResults } = await connection.query(
      sql`
        select * from sessions
        where
          id = ${sstack_session_id}
          and device_id = ${sstack_device_id}
          and expires_at > now();
      `
    )

    const session = sessionResults[0]

    if (!session) {
      throw createError(403)
      // TODO create anon session?
    } else {
      // update expiry
      await connection.query(
        sql`
          update sessions
          set
            expires_at = now() + interval '7 days'
          where
            id = ${sstack_session_id}
            and device_id = ${sstack_device_id}
        `
      )
    }

    return {
      statusCode: 204
    }
  })
)
