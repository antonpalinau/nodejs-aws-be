import productList from "../assets/productList.json";
import { getAllProducts } from "../handlers/getAllProducts";

describe("getAllProducts", () => {
  test("should return all products", async () => {
    const mockResponse = {
      statusCode: 200,
      headers: {
        "Access-Control-Allow-Origin": "*",
      },
      body: JSON.stringify(productList),
    };
    const response: any = await getAllProducts(null, null, null);

    expect(response.body).toBe(mockResponse.body);
    expect(response.statusCode).toBe(mockResponse.statusCode);
  });
});
