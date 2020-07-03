exports.up = function (knex) {
  return knex.schema.raw(`
    CREATE TABLE IF NOT EXISTS magic_link(
      id SERIAL PRIMARY KEY,
      email VARCHAR(256) NOT NULL,
      token VARCHAR(256) NOT NULL,
      browser_id VARCHAR(32) NOT NULL,
      expires_at TIMESTAMP NOT NULL,
      created_at TIMESTAMP NOT NULL DEFAULT NOW()
    );
  `)
}

exports.down = function (knex) {
  return knex.schema.raw(`
    DROP TABLE magic_link;
  `)
}
