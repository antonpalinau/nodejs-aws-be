import { APIGatewayProxyHandler } from "aws-lambda";
import { validate } from "uuid";
import { createClient } from "../utils/db/createClient";
import { defaultCors } from "../constants";

export const getProductById: APIGatewayProxyHandler = async (event) => {
  console.log("Lambda getProductById invocation with event: ", event);
  const client = await createClient();

  try {
    const { productId } = event.pathParameters;

    if (!validate(productId)) {
      return {
        statusCode: 400,
        headers: defaultCors,
        body: "UUID is expected",
      };
    }

    const getProductQuery = `
      SELECT p.id, p.description, p.title, p.price, s.count
        FROM product p, stock s
          WHERE p.id = s.product_id AND p.id = $1
    `;
    console.log("by id: ", await client.query(getProductQuery, [productId]));
    const product = (await client.query(getProductQuery, [productId]))
      ?.rows?.[0];

    if (product) {
      return {
        statusCode: 200,
        headers: defaultCors,
        body: JSON.stringify(product, null, 2),
      };
    }

    return {
      statusCode: 404,
      body: "Product not found",
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
