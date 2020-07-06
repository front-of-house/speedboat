import 'module-alias/register'
import assert from 'assert'
import baretest from 'baretest'
import { sql } from 'slonik'

import { connection } from '@/api/connection.ts'
import { handler } from '@/api/routes/v1-auth-generateLink.ts'

const test = baretest('@/api/routes/v1-auth-generateLink.ts')

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

test('works', async () => {
  const res = await handler(event, {})

  assert.equal(res.statusCode, 201)
})

!(async function () {
  await test.run()
})()
