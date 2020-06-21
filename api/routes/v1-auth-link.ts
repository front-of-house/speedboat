import { APIGatewayProxyHandler } from 'aws-lambda'

import { MagicLink } from '@/db/models/MagicLink.ts';

export const handler: APIGatewayProxyHandler = async (event, context) => {
  const link = await MagicLink.forge({
    email: 'eric@gmail.com',
    token: 'a',
    browser_id: 'b',
    expires_at: Date.now() + (5 * 60 * 1000),
  }).save();
  console.log(link.toJSON());

  return {
    statusCode: 200,
    headers: {
      'content-type': 'application/json',
    },
    body: '{}',
  };
}
