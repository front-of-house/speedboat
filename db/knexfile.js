const { NODE_ENV, PG_URL } = process.env

const connections = {
  production: PG_URL,
  development: 'postgresql://postgres@0.0.0.0:5433/postgres',
  test: 'postgresql://postgres@0.0.0.0:5433/postgres'
}

const connection = connections[NODE_ENV]

module.exports = {
  client: 'pg',
  connection,
  migrations: {
    tableName: 'migrations',
    directory: './migrations',
    stub: 'default.stub'
  }
}
