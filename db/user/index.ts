import { sql } from 'slonik'
import { db } from '@/db/connection.ts'

import { User } from '@/db/user/types.ts'

export async function upsertUserByEmail (email: User['email']) {
  return await db.query<User>(
    sql`
      insert into users (
        email,
        last_login
      )
      values (
        ${email},
        now()::timestamp
      )
      on conflict (
        email
      )
      do update
          set last_login = now()::timestamp
      returning *;
    `
  )
}
