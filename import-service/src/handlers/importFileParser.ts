import { APIGatewayProxyHandler } from "aws-lambda";
import * as csv from "csv-parser";
import * as AWS from "aws-sdk";
import { BUCKET } from "../constants";

export const importFileParser: APIGatewayProxyHandler = async (event) => {
  try {
    const s3 = new AWS.S3({ region: "eu-west-1" });

    for (const record of event.Records) {
      const objectKey = record.s3.object.key;

      const stream = s3
        .getObject({
          Bucket: BUCKET,
          Key: objectKey,
        })
        .createReadStream();

      await new Promise((res, rej) => {
        stream
          .pipe(csv())
          .on("data", (data) => {
            console.log(data);
          })
          .on("end", res)
          .on("error", rej);
      });

      console.log(`Copy from ${BUCKET}/${objectKey}`);

      await s3
        .copyObject({
          Bucket: BUCKET,
          CopySource: `${BUCKET}/${objectKey}`,
          Key: objectKey.replace("uploaded", "parsed"),
        })
        .promise();

      await s3
        .deleteObject({
          Bucket: BUCKET,
          Key: objectKey,
        })
        .promise();

      console.log(
        `Copied into ${BUCKET}/${objectKey.replace("uploaded", "parsed")}`
      );
    }
  } catch (error) {
    console.log(error);
  }
};
