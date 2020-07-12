import { sql } from 'slonik'
import { db } from '@/db/connection.ts'

import { AuthLink } from '@/db/auth/types.ts'

export async function createAuthLink ({
  email,
  token,
  device_id
}: {
  email: string
  token: string
  device_id: string
}) {
  return await db.query<AuthLink>(
    sql`
      insert into auth_links (
        email,
        token,
        device_id,
        expires_at
      )
      values (
        ${email},
        ${token},
        ${device_id},
        now()::timestamp + interval '5 minutes'
      )
      returning *;
    `
  )
}

export async function getAuthLinksById (id: number) {
  return await db.query<AuthLink>(
    sql`
      select * from auth_links
      where
        id = ${id};
    `
  )
}

export async function getAuthLinksByToken (token: string) {
  return await db.query<AuthLink>(
    sql`
      select * from auth_links
      where
        token = ${token}
        and expires_at >= now()::timestamp;
    `
  )
}

export async function expireAuthLinksByEmail (email: string) {
  return await db.query(
    sql`
      update
        auth_links
      set
        expires_at = now()::timestamp
      where
        email = ${email} and expires_at >= now();
    `
  )
}

export async function expireAuthLinksByToken (token: string) {
  return await db.query(
    sql`
      update
        auth_links
      set
        expires_at = now()::timestamp
      where
        token = ${token} and expires_at >= now()::timestamp;
    `
  )
}
