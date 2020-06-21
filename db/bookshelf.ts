import Bookshelf from "bookshelf";

import { knex } from '@/db/knex.ts';

// @ts-ignore
export const bookshelf = Bookshelf(knex);
