import { ConnectionOptions } from "typeorm";

const { NODE_ENV = 'development', PG_URL } = process.env;

const configs: { [k: string]: ConnectionOptions } = {
  development: {
    type: "sqlite",
    database: "./database/dev.sqlite3",
  },
  production: {
    type: "postgres",
    url: PG_URL,
  },
}

export default {
  ...(configs[NODE_ENV]),
  synchronize: true,
  logging: false,
  entities: [
    "db/entity/**/*.ts"
  ],
  migrations: [
    "db/migration/**/*.ts"
  ],
  subscribers: [
    "db/subscriber/**/*.ts"
  ]
}
