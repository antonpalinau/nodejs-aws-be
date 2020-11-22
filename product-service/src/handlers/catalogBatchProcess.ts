import * as AWS from "aws-sdk";
import { APIGatewayProxyHandler } from "aws-lambda";
import { createClient } from "../utils/db/createClient";
import { defaultCors } from "../constants";
import { productSchema } from "../models/product";

export const catalogBatchProcess: APIGatewayProxyHandler = async (event) => {
  console.log("Lambda catalogBatchProcess invocation with event: ", event);
  const client = await createClient();
  try {
    const sns = new AWS.SNS({ region: "eu-west-1" });
    const products = event.Records.map(async ({ body }) => {
      const { title, description, price, count } = JSON.parse(body);

      try {
        await productSchema.validateAsync({ title, description, price, count });
      } catch (error) {
        const msg = "Products have not been saved because the data is invalid";
        await snsPublish(sns, false, msg);

        return;
      }

      try {
        await insertProductIntoDb(client, { title, description, price, count });
        const msg = "Products have been saved to the DB";
        await snsPublish(sns, true, msg);
      } catch (error) {
        const msg =
          "Products have not been saved because of failure while inserting in DB";
        await snsPublish(sns, false, msg);
      }
    });

    await Promise.all(products);
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

export const snsPublish = async (sns, success: boolean, msg: string) => {
  try {
    await sns
      .publish({
        Subject: "New products notification",
        Message: msg,
        MessageAttributes: {
          status: {
            DataType: "String",
            StringValue: success ? "Success" : "Error",
          },
        },
        TopicArn: process.env.SNS_ARN,
      })
      .promise();
    console.error(msg);
  } catch (error) {
    console.error("Error happened while publishing a message");
  }
};

export const insertProductIntoDb = async (
  client,
  { title, description, price, count }
) => {
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
    (await client.query(createProductQuery, [title, description, price, count]))
      ?.rows?.[0];

    await client.query("COMMIT");
  } catch (error) {
    console.error("error in transaction: ", error);
    await client.query("ROLLBACK");

    throw error;
  }
};
