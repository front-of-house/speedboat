exports.up = async function (knex) {
  await knex.schema.raw(`
    create table if not exists sessions (
      id serial primary key,
      user_id integer not null references users(id),
      device_id varchar(32) not null,
      expires_at TIMESTAMP not null default (now()::timestamp + interval '7 days')
    );
  `)
}

exports.down = async function (knex) {
  await knex.schema.raw(`
    drop table sessions;
  `)
}
