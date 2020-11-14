// @ts-nocheck
import * as AWS from "aws-sdk-mock";
import { importProductsFile } from "../handlers/importProductsFile";

describe("importProductsFile lamda", () => {
  beforeAll(() => {
    AWS.mock("S3", "getSignedUrlPromise", Promise.resolve("http://url.com"));
  });

  afterAll(() => {
    AWS.restore();
  });

  it("importProductsFile should return 400 status code if filename is incorrect", async () => {
    const response = await importProductsFile({
      queryStringParameters: {
        name: "",
      },
    });

    expect(response.statusCode).toBe(400);
  });

  it("importProductsFile should return 202 status code with url", async () => {
    const response = await importProductsFile({
      queryStringParameters: {
        name: "products.csv",
      },
    });
    expect(response.statusCode).toBe(202);
    expect(response.body).toBe("http://url.com");
  });
});
