import { sstack, main, Handler } from 'sstack'
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
// const customErrorHandler = require('@/api/middleware/errors.js')

export function core (...handlers: Handler[]) {
  return sstack(
    [
      parse(),
      parseCookies(),
      main(handlers),
      body(),
      serializeCookies(),
      stringify(),
      helmet()
    ],
    [errors(), stringify()]
  )
}