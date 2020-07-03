import { createPool } from 'slonik'

export const connection = createPool('postgresql://localhost:5432/sandbox')
