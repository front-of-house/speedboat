import { GET } from 'sstack'
import createError from 'http-errors'

import { core } from '@/api/middleware/core'

import { getSessionById, refreshSessionById } from '@/db/session'

export const handler = core(
  GET(async event => {
    const { sstack_session_id, sstack_device_id } = event.cookies

    if (!sstack_session_id || !sstack_device_id) {
      throw createError(403)
      // TODO create anon session?
    }

    const { rows: sessionResults } = await getSessionById(sstack_session_id)
    const session = sessionResults[0]

    if (!session) {
      throw createError(403)
      // TODO create anon session?
    } else {
      // update expiry
      await refreshSessionById(sstack_session_id)
    }

    return {
      statusCode: 204
    }
  })
)
