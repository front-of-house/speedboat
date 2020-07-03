import { sql } from 'slonik'
import { nanoid } from 'nanoid'
import createError from 'http-errors'
import { GET, POST } from 'sstack'

import { core } from '@/api/middleware/core'
import { connection } from '@/api/connection.ts'
import { AuthLink } from '@/api/routes/v1-auth-link/types'

const FIVE_MINUTES = 5 * 60 * 1000

const post = POST(async (ev: any) => {
  const now = Date.now()

  const { email } = ev.body

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

  const { rows } = await connection.query<Pick<AuthLink, 'browser_id'>>(
    sql`
      insert into magic_link
        (email, token, browser_id, expires_at)
      values (
        ${email},
        ${nanoid()},
        ${nanoid()},
        to_timestamp(${now + FIVE_MINUTES} / 1000.0)
      )
      returning browser_id;
        `
  )

  return {
    statusCode: 200,
    headers: {
      // TODO need to set expiry
      'set-cookie': `speedboat_browser_id=${rows[0].browser_id}`
    },
    body: {
      success: true
    }
  }
})

const get = GET(async (ev: any) => {
  const now = Date.now()

  const { speedboat_browser_id } = ev.cookies
  const { token } = ev.queryStringParameters

  const { rows } = await connection.query<AuthLink>(
    // prettier-ignore
    sql`
      select
        browser_id from magic_link
      where
        token = ${token}
        and expires_at >= to_timestamp(${now} / 1000.0)
    `
  )

  const obj = rows[0]

  if (!obj) {
    throw createError(403, `Token is expired or invalid`)
  } else if (obj.browser_id !== speedboat_browser_id) {
    throw createError(403, `Invalid browser`)
  }

  return {
    statusCode: 200,
    body: {
      success: true
    }
  }
})

export const handler = core(post, get)
