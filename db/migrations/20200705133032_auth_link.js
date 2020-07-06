exports.up = async function (knex) {
  await knex.schema.raw(`
    create table if not exists auth_links(
      id serial primary key,
      email varchar(256) not null,
      token varchar(256) not null,
      device_id varchar(32) not null,
      expires_at timestamp not null,
      created_at timestamp not null default now()
    );
  `)
}

exports.down = async function (knex) {
  await knex.schema.raw(`
    drop table auth_links;
  `)
}
