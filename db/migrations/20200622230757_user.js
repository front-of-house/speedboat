
exports.up = function(knex) {
  return knex.schema.raw(`
    CREATE TABLE IF NOT EXISTS "user"(
      id SERIAL PRIMARY KEY,
      email VARCHAR(256) NOT NULL
    );
  `);
};

exports.down = function(knex) {
  return knex.schema.raw(`
    DROP TABLE "user";
  `);
};
