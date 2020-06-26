// @ts-ignore
import { sstack, handler } from 'sstack';
// @ts-ignore
import { parse, stringify } from '@sstack/json';
// @ts-ignore
import helmet from '@sstack/helmet';
// @ts-ignore
import cookies from '@sstack/cookies';
// @ts-ignore
import validate from '@sstack/validate';
// @ts-ignore
import errors from '@sstack/errors';

// const customErrorHandler = require('@/api/middleware/errors.js')

export function core(fn: any, options: any = {}) {
  let {
    auth,
    request,
    response
  } = options

  if (auth && !Array.isArray(auth)) {
    auth = []
  }

  return sstack([
    /**
     * Parse incoming request bodies to JSON
     */
    parse(),
    request && validate.request(request, {
      ajv: {
        removeAdditional: true
      }
    }),
    /**
     * Attach cookies to ev.cookies = {}
     */
    cookies(),
    /**
     * Our route handler
     */
    handler(
      fn
    ),
    /**
     * Validate response, *after* our handler fn returns
     */
    response && validate.response(response, {
      ajv: {
        removeAdditional: true
      }
    }),
    /**
     * Attach a default body if none exists
     */
    (handler: any) => {
      const res = handler.response
      res.body = res.body || ''
    },
    /**
     * Stringify (almost) last
     */
    stringify(),
    helmet()
  ].filter(Boolean), [
    /**
     * Handles Auth0 and Sentry errors, allows
     * native errors to pass through
     */
    errors(),
    /**
     * Again, stringify last
     */
    stringify()
  ])
}
