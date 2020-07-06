import { sql } from 'slonik'
import { nanoid } from 'nanoid'
import { POST } from 'sstack'

import { core } from '@/api/middleware/core'
import { connection } from '@/api/connection.ts'
import { guards } from '@/api/auth'
import { decode } from '@/api/lib/decode'

const { NODE_ENV } = process.env
const PROD = NODE_ENV === 'production'

export const handler = core(
  POST(async event => {
    const { email } = decode(event, guards.generateLinkPayload)

    // expire any existing active links
    await connection.query(
      sql`
        update
          auth_links
        set
          expires_at = now()
        where
          email = ${email} and expires_at > now();
      `
    )

    const device_id = nanoid()

    await connection.query(
      sql`
        insert into auth_links (
          email,
          token,
          device_id,
          expires_at
        )
        values (
          ${email},
          ${nanoid()},
          ${device_id},
          now()::timestamp + interval '5 minutes'
        )
        returning *;
      `
    )

    // TODO send email

    return {
      statusCode: 201,
      cookies: {
        sstack_device_id: [
          device_id,
          PROD
            ? {
                secure: true,
                httpOnly: true,
                sameSite: 'strict',
                expires: new Date(Date.now() + 365 * 24 * 60 * 60 * 1000)
              }
            : {
                httpOnly: true,
                sameSite: 'strict',
                expires: new Date(Date.now() + 365 * 24 * 60 * 60 * 1000)
              }
        ]
      }
    }
  })
)
