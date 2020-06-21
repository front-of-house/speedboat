require("@babel/register");

import path from 'path';

const { NODE_ENV, PG_URL } = process.env;
const PROD = NODE_ENV === "production";

export const client = PROD ? "postgres" : "sqlite3";

export const connection = PROD
  ? PG_URL
  : {
      filename: path.join(__dirname, "/databases/dev.sqlite3"),
    };

export const migrations = {
  tableName: "migrations",
  directory: "./migrations",
  extension: "ts",
};
