import { Middleware } from 'sstack'
import { nanoid } from 'nanoid'

const { NODE_ENV } = process.env
const PROD = NODE_ENV === 'production'

export function setBrowserId (): Middleware {
  return async request => {
    if (!request.event.cookies.sstack_device_id) {
      request.response.cookies = {
        ...request.response.cookies,
        sstack_device_id: [
          nanoid(),
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
  }
}
