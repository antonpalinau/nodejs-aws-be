import { getProductById } from "../handlers/getProductById";

describe("getProductById", () => {
  test("should return product by id", async () => {
    const product = {
      count: 13,
      description: "High-top sneakers in nylon and leather",
      id: "7567ec4b-b10c-48c5-9345-fc73c48a80a1",
      price: 95.0,
      title: "S-DESE ML",
      imageUrl:
        "https://shop.diesel.com/dw/image/v2/BBLG_PRD/on/demandware.static/-/Sites-diesel-master-catalog/default/dwd24a033b/images/large/Y02446_PS719_T8013_F.jpg",
    };

    const mockResponse = {
      statusCode: 200,
      headers: {
        "Access-Control-Allow-Origin": "*",
      },
      body: JSON.stringify(product),
    };

    const event: any = {
      pathParameters: {
        productId: "7567ec4b-b10c-48c5-9345-fc73c48a80a1",
      },
    };
    const response: any = await getProductById(event, null, null);

    expect(response.body).toBe(mockResponse.body);
    expect(response.statusCode).toBe(mockResponse.statusCode);
  });
  test("should return product not found", async () => {
    const mockResponse = {
      statusCode: 404,
      headers: {
        "Access-Control-Allow-Origin": "*",
      },
      body: "Product not found",
    };

    const event: any = {
      pathParameters: {
        productId: "2",
      },
    };
    const response: any = await getProductById(event, null, null);

    expect(response.body).toBe(mockResponse.body);
    expect(response.statusCode).toBe(mockResponse.statusCode);
  });
});
