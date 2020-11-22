import { APIGatewayProxyHandler } from "aws-lambda";
import * as csv from "csv-parser";
import * as AWS from "aws-sdk";
import { BUCKET } from "../constants";

export const importFileParser: APIGatewayProxyHandler = async (event) => {
  try {
    const s3 = new AWS.S3({ region: "eu-west-1" });
    const sqs = new AWS.SQS();

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
            sqs.sendMessage(
              {
                QueueUrl: process.env.SQS_URL,
                MessageBody: JSON.stringify(data),
              },
              (error, data) => {
                if (error) {
                  console.log(
                    "SQS error happened while sending to a queue:",
                    error
                  );
                  return;
                }

                console.log("Product has been sent to the SQS:", data);
              }
            );
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
