import "reflect-metadata";
import { APIGatewayProxyHandler } from 'aws-lambda'

import { getConnection } from '@/db/connection.ts';
import { MagicLink } from '@/db/entity/MagicLink.ts';

export const handler: APIGatewayProxyHandler = async (event, context) => {
  const connection = await getConnection();
  // console.log(connection.getRepository(MagicLink));

  return {
    statusCode: 200,
    headers: {
      'content-type': 'application/json',
    },
    body: '{}',
  };
}
