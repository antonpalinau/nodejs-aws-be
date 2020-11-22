import "source-map-support/register";
import { getAllProducts } from "./src/handlers/getAllProducts";
import { getProductById } from "./src/handlers/getProductById";
import { createProduct } from "./src/handlers/createProduct";
import { catalogBatchProcess } from "./src/handlers/catalogBatchProcess";

export { getAllProducts, getProductById, createProduct, catalogBatchProcess };
