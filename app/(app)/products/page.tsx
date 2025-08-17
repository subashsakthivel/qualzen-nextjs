import ProductGallery from "@/components/product-gallery";
import { ProductGrid } from "@/components/product-grid";
import { DataModel } from "@/model/DataModels";
import { DataSourceMap } from "@/model/DataSourceMap";
import { TProduct, TProductRes } from "@/schema/Product";
import { TProductVariant } from "@/schema/ProductVarient";
import { getData } from "@/util/dataAPI";
import { PaginateResult } from "mongoose";
const products: TProductRes[] = [
  {
    category: "ssa",
    description: "fewf",
    images: ["https://i.pinimg.com/736x/50/da/b6/50dab62ca362c53da99147a477572ea4.jpg"],
    isActive: true,
    name: "fredo.",
    price: 8909,
    sellingPrice: 89,
    sku: "cdn",
    stockQuantity: 9,
    tags: ["cksdl"],
    _id: "123qaz",
    brand: "cndkscsd",
    instructions: "ckdsnlcsdklclmcdmkldsc",
    otherdetails: "cndskcndscinsdlkncd",
    relatedLinks: ["cknsdcsdncnl"],
    attributes: [
      {
        name: "color",
        value: "red",
        sortOrder: 1,
      },
      {
        name: "size",
        value: "red",
        sortOrder: 1,
      },
    ],
    variants: [
      {
        _id: "wsx",
        sku: "",
        price: 1020,
        sellingPrice: 1000,
        stockQuantity: 10,
        images: ["https://i.pinimg.com/736x/50/da/b6/50dab62ca362c53da99147a477572ea4.jpg"],
        attributes: [
          {
            name: "color",
            value: "red",
            sortOrder: 1,
          },
          {
            name: "size",
            value: "red",
            sortOrder: 1,
          },
        ],
        isActive: true,
      },
    ],
  },
  {
    category: "ssa",
    description: "fewf",
    images: ["https://i.pinimg.com/736x/50/da/b6/50dab62ca362c53da99147a477572ea4.jpg"],
    isActive: true,
    name: "ccdcd",
    price: 8909,
    sellingPrice: 89,
    sku: "cdn",
    stockQuantity: 9,
    tags: ["cksdl"],
    _id: "xsw",
    brand: "cndkscsd",
    instructions: "ckdsnlcsdklclmcdmkldsc",
    otherdetails: "cndskcndscinsdlkncd",
    relatedLinks: ["cknsdcsdncnl"],
    attributes: [
      {
        name: "color",
        value: "red",
        sortOrder: 1,
      },
      {
        name: "size",
        value: "red",
        sortOrder: 1,
      },
    ],
    variants: [
      {
        _id: "edc",
        sku: "",
        price: 1020,
        sellingPrice: 1000,
        stockQuantity: 10,
        images: ["https://i.pinimg.com/736x/31/88/ac/3188acc506f958572159294cad922b0d.jpg"],
        attributes: [
          {
            name: "color",
            value: "red",
            sortOrder: 1,
          },
          {
            name: "size",
            value: "red",
            sortOrder: 1,
          },
        ],
        isActive: true,
      },
    ],
  },
  {
    category: "csjkadjk",
    description: "fewf",
    images: ["https://i.pinimg.com/1200x/6f/3d/08/6f3d089f49c67026d70bc463ba49fe6e.jpg"],
    isActive: true,
    name: "ccdcd",
    price: 8909,
    sellingPrice: 89,
    sku: "cdn",
    stockQuantity: 9,
    tags: ["cksdl"],
    _id: "cde",
    brand: "cndkscsd",
    instructions: "ckdsnlcsdklclmcdmkldsc",
    otherdetails: "cndskcndscinsdlkncd",
    relatedLinks: ["cknsdcsdncnl"],
    attributes: [
      {
        name: "color",
        value: "red",
        sortOrder: 1,
      },
      {
        name: "size",
        value: "red",
        sortOrder: 1,
      },
    ],
    variants: [],
  },
];

const productsTest: PaginateResult<TProductRes> = {
  docs: products,
  hasNextPage: false,
  hasPrevPage: false,
  limit: 10,
  offset: 10,
  pagingCounter: 9,
  totalDocs: 2,
  totalPages: 1,
};
function getProducts(products: TProduct[]) {
  // can move this to after proces in db schema
  const response = [];
  for (let i = 0; i < products.length; i++) {
    const parentProduct = products[i];
    const productVariants = parentProduct.variants;
    productVariants
      .filter((v) => typeof v !== "string")
      .map((variant) => {
        response.push({
          ...variant,
          parentProduct: { ...parentProduct },
        });
      });
  }
}
export default async function ProductsPage() {
  // const initResponse = await getData<TProductRes>(DataModel.product, "GET_DATA", {
  //   populate: [{ path: "variants" }],
  //   limit: 20,
  // });
  return (
    <div className="container px-4 py-12 mx-auto">
      <div className="flex flex-col items-center text-center space-y-2 mb-12">
        <h1 className="text-3xl font-bold tracking-tight">All Products</h1>
        <p className="text-muted-foreground max-w-[600px]">
          Browse our complete collection of premium clothing
        </p>
      </div>
      <ProductGallery initialProducts={productsTest} />
    </div>
  );
}
