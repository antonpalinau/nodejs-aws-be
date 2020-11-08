import { Client } from "pg";
import { APIGatewayProxyHandler } from "aws-lambda";

const { PG_HOST, PG_PORT, PG_DATABASE, PG_USERNAME, PG_PASSWORD } = process.env;
const dbOptions = {
  host: PG_HOST,
  port: PG_PORT,
  database: PG_DATABASE,
  user: PG_USERNAME,
  password: PG_PASSWORD,
  ssl: {
    rejectUnauthorized: false,
  },
  connectionTimeoutMillis: 5000,
};

export const getAllProducts: APIGatewayProxyHandler = async (event) => {
  const client = new Client(dbOptions);
  await client.connect();
  try {
    console.log("Lambda getAllProducts invocation with event: ", event);
    const { rows: product } = await client.query(`select * from product`);
    console.log(product);
    return {
      statusCode: 200,
      headers: {
        "Access-Control-Allow-Origin": "*",
      },
      body: JSON.stringify(product),
    };
  } catch (error) {
    return {
      statusCode: 500,
      headers: {
        "Access-Control-Allow-Origin": "*",
      },
      body: "Something went wrong.",
    };
  } finally {
    client.end();
  }
};
