import * as Knex from "knex";

export async function up(knex: Knex): Promise<any> {
  await knex.schema.createTable("magic_link", table => {
    table.increments();
    table.string("email", 128);
    table.string("token", 256);
    table.string("browser_id", 36);
    table.string("expires_at", 36);
    table.timestamps();
  });
}

export async function down(knex: Knex): Promise<any> {
  await knex.schema.dropTableIfExists('magic_link');
}
