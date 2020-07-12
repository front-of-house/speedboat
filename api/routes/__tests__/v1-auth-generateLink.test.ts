import test from 'ava'
import sinon from 'sinon'

import { handler } from '@/api/routes/v1-auth-generateLink'
import * as authQueries from '@/db/auth'
import * as emailSenders from '@/api/auth/email'

const event = {
  httpMethod: 'POST',
  path: '/',
  headers: {
    'content-type': 'application/json'
  },
  body: JSON.stringify({
    email: 'm.rapinoe@gmail.com'
  }),
  queryStringParameters: {},
  isBase64Encoded: false,
  cookies: {}
}

test.afterEach(() => {
  sinon.restore()
})

test('works', async t => {
  const auth = sinon.stub(authQueries)
  const email = sinon.stub(emailSenders)

  const res = await handler(event, {})

  t.is(res.statusCode, 201)
  t.truthy(res.multiValueHeaders?.['set-cookie']) // TODO ?
  t.truthy(auth.expireAuthLinksByEmail.called)
  t.truthy(auth.createAuthLink.called)
  t.truthy(email.sendAuthLink.called)
})
