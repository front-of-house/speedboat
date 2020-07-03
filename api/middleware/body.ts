import { Middleware } from 'sstack'

export function body (): Middleware {
  return async request => {
    const res = request.response
    res.body = res.body || '{}'
  }
}
