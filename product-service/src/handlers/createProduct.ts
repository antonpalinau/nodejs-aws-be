import { APIGatewayProxyHandler } from "aws-lambda";
import { createClient } from "../utils/db/createClient";
import { defaultCors } from "../constants";
import { productSchema } from "../models/product";

export const createProduct: APIGatewayProxyHandler = async (event) => {
  console.log("Lambda createProduct invocation with event: ", event);
  const client = await createClient();

  try {
    const { title, description, price, count } = JSON.parse(event.body);

    try {
      await productSchema.validateAsync({
        title,
        description,
        price,
        count,
      });
    } catch (error) {
      return {
        statusCode: 400,
        headers: defaultCors,
        body: error.message,
      };
    }

    try {
      await client.query("BEGIN");

      const createProductQuery = `
        WITH insert_product AS (
            INSERT INTO product(title, description, price)
            VALUES ($1, $2, $3)
            RETURNING id, title, description, price
        ), insert_stock AS (
            INSERT INTO stock(product_id, count)
            VALUES ( (SELECT id FROM insert_product), $4)
            RETURNING product_id, count
        )
        SELECT id, title, description, price, count
            FROM insert_product
            INNER JOIN insert_stock ON id = product_id
      `;
      const result = (
        await client.query(createProductQuery, [
          title,
          description,
          price,
          count,
        ])
      )?.rows?.[0];

      await client.query("COMMIT");

      return {
        statusCode: 200,
        headers: defaultCors,
        body: JSON.stringify(result, null, 2),
      };
    } catch (error) {
      console.error("error in transaction: ", error);
      await client.query("ROLLBACK");

      throw error;
    }
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
