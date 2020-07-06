import { sql } from 'slonik'
import createError from 'http-errors'
import { POST } from 'sstack'

import { core } from '@/api/middleware/core'
import { connection } from '@/api/connection.ts'
import { guards, AuthLink } from '@/api/auth'
import { decode } from '@/api/lib/decode'

const { NODE_ENV } = process.env
const PROD = NODE_ENV === 'production'

export const handler = core(
  POST(async event => {
    const { sstack_device_id } = event.cookies
    const { token } = decode(event, guards.validateLinkPayload)

    const { rows: linkResults } = await connection.query<AuthLink>(
      sql`
        select * from auth_links
        where
          token = ${token}
          and expires_at >= now()
      `
    )

    const link = linkResults[0]

    if (!link) {
      throw createError(
        403,
        `Token was already used, or is expired or invalid.`
      )
    } else if (link.device_id !== sstack_device_id) {
      throw createError(403, `Invalid browser.`)
    }

    // expire current token
    await connection.query(
      sql`
        update
          auth_links
        set
          expires_at = now()
        where
          token = ${token};
      `
    )

    // create user
    const { rows: userResults } = await connection.query(
      sql`
        insert into users (
          email,
          last_login
        )
        values
          (${link.email}, now())
        on conflict (
          email
        )
        do update
            set last_login = now()
        returning *;
      `
    )

    // create session
    const { rows: sessionResults } = await connection.query(
      sql`
        insert into sessions (
          user_id,
          device_id
        )
        values
          (
            ${userResults[0].id},
            ${link.device_id}
          )
        returning id;
      `
    )

    // TODO send login email

    return {
      statusCode: 204,
      cookies: {
        sstack_session_id: [
          sessionResults[0].id,
          PROD
            ? {
                secure: true,
                httpOnly: true,
                sameSite: 'strict',
                expires: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000) // 7 days
              }
            : {
                httpOnly: true,
                sameSite: 'strict',
                expires: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000) // 7 days
              }
        ]
      }
    }
  })
)
