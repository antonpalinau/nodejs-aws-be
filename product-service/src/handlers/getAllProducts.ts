import { APIGatewayProxyHandler } from "aws-lambda";
import { createClient } from "../utils/db/createClient";
import { defaultCors } from "../constants";

export const getAllProducts: APIGatewayProxyHandler = async (event) => {
  console.log("Lambda getAllProducts invocation with event: ", event);
  const client = await createClient();
  const getProductsQuery = `
    SELECT p.id, p.title, p.description, p.price, s.count
      FROM product p
      INNER JOIN stock s ON p.id = s.product_id
  `;

  try {
    const products = (await client.query(getProductsQuery)).rows;

    return {
      statusCode: 200,
      headers: defaultCors,
      body: JSON.stringify(products, null, 2),
    };
  } catch (error) {
    return {
      statusCode: 500,
      headers: defaultCors,
      body: "Internal server error.",
    };
  } finally {
    client.end();
  }
};
