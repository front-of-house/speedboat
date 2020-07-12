const { NODE_ENV = 'development', PG_URL } = process.env

const connections = {
  production: PG_URL,
  development: 'postgresql://postgres@0.0.0.0:5434/speedboat_dev_db',
  test: 'postgresql://postgres@0.0.0.0:5433/speedboat_test_db'
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
