import ava, { TestInterface } from 'ava'
import sinon from 'sinon'

import { handler } from '@/api/routes/v1-auth-validateLink'
import * as authDB from '@/db/auth'
import * as userDB from '@/db/user'
import * as sessionDB from '@/db/session'
import * as emailSenders from '@/api/auth/email'

const test = ava as TestInterface<any>

const event = {
  httpMethod: 'POST',
  path: '/',
  headers: {
    'content-type': 'application/json'
  },
  body: JSON.stringify({
    token: 'abcdefg'
  }),
  queryStringParameters: {},
  isBase64Encoded: false,
  cookies: {
    sstack_device_id: '123'
  }
}

test.afterEach(() => {
  sinon.restore()
})

test.serial('throws if no link', async t => {
  // @ts-ignore
  const auth = sinon.stub(authDB, 'getAuthLinksByToken').returns({ rows: [] })

  const res = await handler({ ...event }, {})

  t.is(res.statusCode, 403)
  t.truthy(
    /already\sused/.test(JSON.parse(res.body as string).errors[0].details)
  )

  auth.restore()
})

test.serial(`throws if device_id doesn't match`, async t => {
  const linkFake = {
    device_id: '456'
  }

  const getAuthLinksByToken = sinon
    .stub(authDB, 'getAuthLinksByToken')
    // @ts-ignore
    .returns({ rows: [linkFake] })

  const res = await handler({ ...event }, {})

  t.is(res.statusCode, 403)
  t.truthy(/Invalid/.test(JSON.parse(res.body as string).errors[0].details))

  getAuthLinksByToken.restore()
})

test.serial(`works`, async t => {
  const linkFake = {
    device_id: '123'
  }
  const userFake = {
    id: 1
  }
  const sessionFake = {
    session_id: 'abc'
  }

  const getAuthLinksByToken = sinon
    .stub(authDB, 'getAuthLinksByToken')
    // @ts-ignore
    .returns({ rows: [linkFake] })
  const upsertUserByEmail = sinon
    .stub(userDB, 'upsertUserByEmail')
    // @ts-ignore
    .returns({ rows: [userFake] })
  const createSession = sinon
    .stub(sessionDB, 'createSession')
    // @ts-ignore
    .returns({ rows: [sessionFake] })
  const email = sinon.stub(emailSenders)

  const res = await handler({ ...event }, {})

  t.is(res.statusCode, 204)
  t.truthy(email.sendLoginNotice.called)

  getAuthLinksByToken.restore()
  upsertUserByEmail.restore()
  createSession.restore()
})
