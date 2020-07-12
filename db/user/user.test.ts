import test from 'ava'

import { upsertUserByEmail } from '@/db/user'

test('upsertUserByEmail', async t => {
  const upsertRes = await upsertUserByEmail('a@upsertUserByEmail')

  t.is(upsertRes.rows[0].email, 'a@upsertUserByEmail')

  const updateRes = await upsertUserByEmail('a@upsertUserByEmail')

  t.true(upsertRes.rows[0].last_login < updateRes.rows[0].last_login)
})
