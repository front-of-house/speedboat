import { sstack, Middleware } from 'sstack'
// @ts-ignore
import { parse, stringify } from '@sstack/json'
// @ts-ignore
import helmet from '@sstack/helmet'
import {
  parse as parseCookies,
  serialize as serializeCookies
} from '@sstack/cookies'
// @ts-ignore
import validate from '@sstack/validate'
// @ts-ignore
import errors from '@sstack/errors'

import { body } from '@/api/middleware/body'
import { setBrowserId } from '@/api/middleware/auth'

export function core (...middlewares: Middleware[]) {
  return sstack(
    [
      parse(),
      parseCookies(),
      setBrowserId(),
      ...middlewares,
      body(),
      serializeCookies(),
      stringify(),
      helmet()
    ],
    [
      req => {
        console.error(req)
      },
      errors(),
      stringify()
    ]
  )
}
