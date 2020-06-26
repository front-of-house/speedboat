import { createPool } from 'slonik';

export const pool = createPool("postgresql://localhost:5432/speedboat");
