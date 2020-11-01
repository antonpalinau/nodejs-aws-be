import { APIGatewayProxyHandler } from "aws-lambda";
import productList from "../assets/productList.json";

export const getAllProducts: APIGatewayProxyHandler = async (event) => {
  try {
    console.log("Lambda getAllProducts invocation with event: ", event);

    return {
      statusCode: 200,
      body: JSON.stringify(productList),
    };
  } catch (error) {
    console.log(error);
  }
};
