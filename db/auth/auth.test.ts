import test from 'ava'

import {
  createAuthLink,
  getAuthLinksByToken,
  getAuthLinksById,
  expireAuthLinksByEmail,
  expireAuthLinksByToken
} from '@/db/auth'

test('createAuthLink', async t => {
  const { rows } = await createAuthLink({
    email: 'foo',
    token: 'bar',
    device_id: 'baz'
  })
  const link = rows[0]

  t.is(link.email, 'foo')
  t.is(link.token, 'bar')
  t.is(link.device_id, 'baz')
})

test('getAuthLinksByToken', async t => {
  // reset for every test
  await expireAuthLinksByEmail('a@getAuthLinksByToken')
  await expireAuthLinksByEmail('b@getAuthLinksByToken')

  await createAuthLink({
    email: 'a@getAuthLinksByToken',
    token: 'a',
    device_id: 'baz'
  })
  await createAuthLink({
    email: 'b@getAuthLinksByToken',
    token: 'a',
    device_id: 'baz'
  })

  // expire one
  await expireAuthLinksByEmail('a@getAuthLinksByToken')

  const { rows } = await getAuthLinksByToken('a')

  // should return one
  t.is(rows[0].email, 'b@getAuthLinksByToken')
  t.is(rows.length, 1)
})

test('expireAuthLinksByEmail', async t => {
  const newLinkRes = await createAuthLink({
    email: 'toExpire',
    token: 'bar',
    device_id: 'baz'
  })

  await expireAuthLinksByEmail('toExpire')

  const expiredLinkRes = await getAuthLinksById(newLinkRes.rows[0].id)
  const link = expiredLinkRes.rows[0]

  t.truthy(link.expires_at <= newLinkRes.rows[0].expires_at)
})

test('expireAuthLinksByToken', async t => {
  const newLinkRes = await createAuthLink({
    email: 'toExpire',
    token: 'bar',
    device_id: 'baz'
  })

  await expireAuthLinksByToken('bar')

  const expiredLinkRes = await getAuthLinksById(newLinkRes.rows[0].id)
  const link = expiredLinkRes.rows[0]

  t.truthy(link.expires_at <= newLinkRes.rows[0].expires_at)
})
