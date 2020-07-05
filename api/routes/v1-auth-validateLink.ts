import { sql } from 'slonik'
import createError from 'http-errors'
import { POST } from 'sstack'

import { core } from '@/api/middleware/core'
import { connection } from '@/api/connection.ts'
import { guards, AuthLink } from '@/api/auth'
import { decode } from '@/api/lib/decode'

export const handler = core(
  POST(async event => {
    const now = Date.now()
    const { sstack_browser_id } = event.cookies
    const { token } = decode(event, guards.validateLinkPayload)

    const { rows } = await connection.query<AuthLink>(
      sql`
        select
          browser_id from magic_link
        where
          token = ${token}
          and expires_at >= to_timestamp(${now} / 1000.0)
      `
    )

    const result = rows[0]

    if (!result) {
      throw createError(403, `Token is expired or invalid`)
    } else if (result.browser_id !== sstack_browser_id) {
      throw createError(403, `Invalid browser`)
    }

    await connection.query(
      sql`
        update
          magic_link
        set
          expires_at = to_timestamp(${now} / 1000.0)
        where
          token = ${token};
      `
    )

    // create user
    // create session

    return {
      statusCode: 200
    }
  })
)
