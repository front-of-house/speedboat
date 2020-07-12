import { nanoid } from 'nanoid'
import { POST } from 'sstack'

import { core } from '@/api/middleware/core'
import { guards } from '@/api/auth'
import { decode } from '@/api/lib/decode'
import { sendAuthLink } from '@/api/auth/email'
import { createAuthLink, expireAuthLinksByEmail } from '@/db/auth'

const { NODE_ENV } = process.env
const PROD = NODE_ENV === 'production'

export const handler = core(
  POST(async event => {
    // TODO middleware this
    const { email } = decode(event, guards.generateLinkPayload)

    await expireAuthLinksByEmail(email)

    const device_id = nanoid()

    await createAuthLink({
      email,
      token: nanoid(),
      device_id
    })

    sendAuthLink({
      to: email,
      link: `http://localhost:8888/api/v1/auth/validateLink`
    })

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
