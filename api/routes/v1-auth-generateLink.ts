import { sql } from 'slonik'
import { nanoid } from 'nanoid'
import { POST } from 'sstack'

import { core } from '@/api/middleware/core'
import { connection } from '@/api/connection.ts'
import { guards } from '@/api/auth'
import { decode } from '@/api/lib/decode'

const FIVE_MINUTES = 5 * 60 * 1000

const { NODE_ENV } = process.env
const PROD = NODE_ENV === 'production'

export const handler = core(
  POST(async event => {
    const now = Date.now()

    const { email } = decode(event, guards.generateLinkPayload)

    // expire any existing active links
    await connection.query(
      sql`
        update
          magic_link
        set
          expires_at = to_timestamp(${now} / 1000.0)
        where
          email = ${email} and expires_at > to_timestamp(${now} / 1000.0);
      `
    )

    const browser_id = nanoid()

    const { rows } = await connection.query(
      sql`
        insert into magic_link
          (email, token, browser_id, expires_at)
        values (
          ${email},
          ${nanoid()},
          ${browser_id},
          to_timestamp(${now + FIVE_MINUTES} / 1000.0)
        )
        returning token;
      `
    )

    // TODO send email

    return {
      statusCode: 201,
      cookies: {
        sstack_browser_id: [
          browser_id,
          PROD
            ? {
                secure: true,
                httpOnly: true,
                sameSite: 'strict'
              }
            : {
                httpOnly: true,
                sameSite: 'strict'
              }
        ]
      }
    }
  })
)
