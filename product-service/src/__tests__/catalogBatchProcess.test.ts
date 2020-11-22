// @ts-nocheck
import {
  catalogBatchProcess,
  insertProductIntoDb,
  snsPublish,
} from "../handlers/catalogBatchProcess";

const successMockData = {
  id: "fcaaae11-5dd5-44cd-81af-d1e33525b6f3",
  title: "T-shirt",
  description: "long t-shirt",
  price: 99.43,
  count: 3,
};

const errorMockData = {
  id: "853982ec-ce63-4886-983b-fbe74de51f86",
  title: 3,
  price: -45,
  count: "",
};

describe("catalogBatchProcess ", () => {
  it("catalogBatchProcess fails validation and returns error", async () => {
    const insertProductIntoDbMock = jest.fn();
    const snsPublishMock = jest.fn();
    const sns = {
      publish: () => {},
    };
    const msg = "Products have not been saved because the data is invalid";

    await catalogBatchProcess({
      Records: [{ body: JSON.stringify(errorMockData) }],
    });

    expect(insertProductIntoDbMock.mock.calls.length).toBe(0);
    expect(snsPublishMock.mock.calls.length).toBe(1);
    expect(snsPublishMock).toHaveBeenCalledWith(sns, false, msg);
  });

  it("catalogBatchProcess passes validation but fails inserting data into db", async () => {
    const insertProductIntoDbMock = jest
      .fn()
      .mockImplementation(() => Promise.reject(value));
    const snsPublishMock = jest.fn();
    const sns = {
      publish: () => {},
    };
    const msg =
      "Products have not been saved because of failure while inserting in DB";

    await catalogBatchProcess({
      Records: [{ body: JSON.stringify(successMockData) }],
    });

    expect(insertProductIntoDbMock.mock.calls.length).toBe(1);
    expect(snsPublishMock.mock.calls.length).toBe(1);
    expect(snsPublishMock).toHaveBeenCalledWith(sns, false, msg);
  });

  it("catalogBatchProcess adds products successfully into the db", async () => {
    const insertProductIntoDbMock = jest
      .fn()
      .mockImplementation(() => Promise.resolve(value));
    const snsPublishMock = jest.fn();
    const sns = {
      publish: () => {},
    };
    const msg = "Products have been saved to the DB";

    await catalogBatchProcess({
      Records: [{ body: JSON.stringify(successMockData) }],
    });

    expect(insertProductIntoDbMock.mock.calls.length).toBe(1);
    expect(snsPublishMock.mock.calls.length).toBe(1);
    expect(snsPublishMock).toHaveBeenCalledWith(sns, true, msg);
  });
});
