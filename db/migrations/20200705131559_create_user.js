exports.up = async function (knex) {
  await knex.schema.raw(`
    create table if not exists users(
      id serial primary key,
      email varchar(256) unique not null,
      name varchar(256),
      nickname varchar(128),
      created_at timestamp default now(),
      last_login timestamp
    );
  `)
}

exports.down = async function (knex) {
  await knex.schema.raw(`
    drop table users;
  `)
}
