import createError from 'http-errors'
import { POST } from 'sstack'
import { nanoid } from 'nanoid'

import { core } from '@/api/middleware/core'
import { guards } from '@/api/auth'
import { decode } from '@/api/lib/decode'

import { getAuthLinksByToken, expireAuthLinksByToken } from '@/db/auth'
import { upsertUserByEmail } from '@/db/user'
import { createSession } from '@/db/session'
import { sendLoginNotice } from '@/api/auth/email'

const { NODE_ENV } = process.env
const PROD = NODE_ENV === 'production'

export const handler = core(
  POST(async event => {
    const { sstack_device_id } = event.cookies
    const { token } = decode(event, guards.validateLinkPayload)

    const { rows: linkResults } = await getAuthLinksByToken(token)
    const link = linkResults[0]

    if (!link) {
      throw createError(
        403,
        `Token was already used, is expired, or is invalid.`
      )
    } else if (link.device_id !== sstack_device_id) {
      throw createError(403, `Invalid browser.`)
    }

    // expire current token
    await expireAuthLinksByToken(token)

    // create user
    const { rows: userResults } = await upsertUserByEmail(link.email)

    // create session
    const { rows: sessionResults } = await createSession({
      session_id: nanoid(),
      user_id: userResults[0].id,
      device_id: link.device_id
    })

    sendLoginNotice({ to: userResults[0].email })

    return {
      statusCode: 204,
      cookies: {
        sstack_session_id: [
          sessionResults[0].session_id,
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
      },
      body: {
        access_token: sessionResults[0].session_id
      }
    }
  })
)
