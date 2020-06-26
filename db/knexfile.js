const { NODE_ENV, PG_URL } = process.env;
const PROD = NODE_ENV === "production";

module.exports = {
  client: 'postgres',
  connection: PROD
  ? PG_URL
  : "postgresql://localhost:5432/speedboat",
  migrations: {
    tableName: "migrations",
    directory: "./migrations",
  }
};
