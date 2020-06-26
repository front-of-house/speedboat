// import { APIGatewayProxyHandler } from 'aws-lambda'
import { sql } from "slonik";

import { core } from "@/api/middleware/core";
import { pool } from "@/db/pool.ts";

export const handler = core(async (ev: any, ctx: any) => {
  const query = await pool.query(sql`SELECT * FROM magic_link`);

  console.log(query);

  return {
    statusCode: 200,
    body: {
      query,
    },
  };
});
