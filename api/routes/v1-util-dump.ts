// import { APIGatewayProxyHandler } from 'aws-lambda'
import { core } from "@/api/middleware/core";

export const handler = core(async (ev: any, ctx: any) => {
  return {
    statusCode: 200,
    body: {
      ev,
      ctx,
    },
  };
});
