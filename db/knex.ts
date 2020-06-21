import Knex from "knex";

import * as config from '@/db/knexfile.ts';

export const knex = Knex(config);
