import { APIGatewayProxyHandler } from "aws-lambda";
import * as AWS from "aws-sdk";
import { BUCKET, defaultCors } from "../constants";

export const importProductsFile: APIGatewayProxyHandler = async (event) => {
  try {
    const fileName = event.queryStringParameters.name;

    if (!fileName) {
      return {
        statusCode: 400,
        body: "Invalid file name",
      };
    }

    const filePath = `uploaded/${fileName}`;
    const s3 = new AWS.S3({ region: "eu-west-1" });
    const params = {
      Bucket: BUCKET,
      Key: filePath,
      Expires: 60,
      ContentType: "text/csv",
    };

    const url = await s3.getSignedUrlPromise("putObject", params);

    return {
      statusCode: 202,
      headers: defaultCors,
      body: url,
    };
  } catch (error) {
    return {
      statusCode: 500,
      headers: defaultCors,
      body: "Internal server error.",
    };
  }
};
