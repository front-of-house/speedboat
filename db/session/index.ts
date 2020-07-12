import { sql } from 'slonik'
import { db } from '@/db/connection.ts'

import { User } from '@/db/user/types.ts'
import { Session } from '@/db/session/types.ts'

export async function createSession ({
  session_id,
  user_id,
  device_id
}: {
  session_id: string
  user_id: User['id']
  device_id: string
}) {
  return await db.query<Session>(
    sql`
      insert into sessions (
        session_id,
        user_id,
        device_id
      )
      values (
        ${session_id},
        ${user_id},
        ${device_id}
      )
      returning *;
    `
  )
}

export async function getSessionById (session_id: string) {
  return await db.query<Session>(
    sql`
      select * from sessions
      where
        session_id = ${session_id}
        and expires_at > now();
    `
  )
}

export async function refreshSessionById (session_id: string) {
  return await db.query(
    sql`
      update sessions
      set
        expires_at = now() + interval '7 days'
      where
        session_id = ${session_id};
    `
  )
}

export async function expireSessionById (session_id: string) {
  return await db.query(
    sql`
      update sessions
      set
        expires_at = now()
      where
        session_id = ${session_id};
    `
  )
}
