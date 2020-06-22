import "reflect-metadata";
import { createConnection } from "typeorm";
import config from '@/db/ormconfig.ts';

export const connection = createConnection(config);

export async function getConnection() {
  return await connection;
}
