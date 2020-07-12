import { createPool } from 'slonik'
import { connection } from '@/db/knexfile'

export const db = createPool(connection)
