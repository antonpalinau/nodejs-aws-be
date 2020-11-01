import { APIGatewayProxyHandler } from "aws-lambda";
import productList from "../assets/productList.json";

export const getProductById: APIGatewayProxyHandler = async (event) => {
  try {
    console.log("Lambda getProductById invocation with event: ", event);
    const { productId } = event.pathParameters;
    const product = productList.find((product) => product.id === productId);

    if (product) {
      return {
        statusCode: 200,
        headers: {
          "Access-Control-Allow-Origin": "*",
        },
        body: JSON.stringify(product),
      };
    }

    return {
      statusCode: 404,
      body: "Product not found",
    };
  } catch (error) {
    console.log(error);
  }
};
