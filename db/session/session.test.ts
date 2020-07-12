import ava, { TestInterface } from 'ava'
import { nanoid } from 'nanoid'

import { upsertUserByEmail } from '@/db/user'
import {
  createSession,
  getSessionById,
  refreshSessionById,
  expireSessionById
} from '@/db/session'

const test = ava as TestInterface<{ user_id: number }>

test.before(async t => {
  const { rows: userRows } = await upsertUserByEmail('a@createSession')

  t.context.user_id = userRows[0].id
})

test('createSession', async t => {
  const session_id = nanoid()

  const { rows: sessionRows } = await createSession({
    session_id: session_id,
    user_id: t.context.user_id,
    device_id: 'a@createSession'
  })

  t.is(sessionRows[0].session_id, session_id)
})

test('createSession - session_id unique constraint', async t => {
  const session_id = nanoid()

  await createSession({
    session_id: session_id,
    user_id: t.context.user_id,
    device_id: 'a@createSession'
  })

  await t.throwsAsync(async () => {
    await createSession({
      session_id: session_id,
      user_id: t.context.user_id,
      device_id: 'a@createSession'
    })
  })
})

test('getSessionById', async t => {
  const session_id = nanoid()

  await createSession({
    session_id,
    user_id: t.context.user_id,
    device_id: 'a@getSessionById'
  })
  const { rows: sessionRows } = await getSessionById(session_id)

  t.is(sessionRows[0].session_id, session_id)
})

test('refreshSessionById', async t => {
  const session_id = nanoid()

  const { rows: sessionRows } = await createSession({
    session_id,
    user_id: t.context.user_id,
    device_id: 'a@getSessionById'
  })
  await refreshSessionById(session_id)
  const { rows: refreshedRows } = await getSessionById(session_id)

  t.truthy(sessionRows[0].expires_at < refreshedRows[0].expires_at)
})

test('expireSessionById', async t => {
  const session_id = nanoid()

  await createSession({
    session_id,
    user_id: t.context.user_id,
    device_id: 'a@getSessionById'
  })
  await expireSessionById(session_id)
  const { rows: refreshedRows } = await getSessionById(session_id)

  t.truthy(refreshedRows.length === 0)
})
