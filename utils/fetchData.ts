"use server";
import dbConnect from "@/lib/mongoose";
import { IProduct, Product } from "@/model/Product";

export interface IProductRes
  extends Omit<IProduct, "marketPrice" | "category" | "createdAt" | "updatedAt" | "properties"> {
  name: string;
  images: string[];
  marketPrice: number;
}
export async function getProducts(offset: number, limit: number): Promise<IProductRes[]> {
  try {
    await dbConnect();
    const products = (await Product.find()
      .skip(offset)
      .limit(limit)
      .select(
        "-marginPrice -_id -__v -category -createdAt -updatedAt -properties"
      )) as IProductRes[];
    console.log("getting products");
    const res = products.map((p) => {
      return {
        name: p.name,
        images: p.images,
        marketPrice: p.marketPrice,
      };
    });
    console.log(products);
    return products;
  } catch (err) {
    console.log(err);
  }
  return [];
}

export async function getData() {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      resolve([
        {
          name: "Unisex Baggy Cotton Shirt 2038 style",
          description: "Hand crafted",
          category: {
            $oid: "6757e405191013a1d9109bae",
          },
          properties: [
            {
              value: ["L", "X", "XXl"],
              _id: {
                $oid: "675d922f223775cb0a8849cf",
              },
            },
            {
              value: ["Kids", "Adults"],
              _id: {
                $oid: "675d922f223775cb0a8849d0",
              },
            },
          ],
          marketPrice: 14000,
          sellPrice: 10000,
          stock: 100,
          images: [
            "https://qualzen-store.s3.amazonaws.com/baggy-shirt-1.jpg-1734185519400.jpg",
            "https://qualzen-store.s3.amazonaws.com/baggy-shirt-2.jpg-1734185519403.jpg",
            "https://qualzen-store.s3.amazonaws.com/baggy-shirt-3.jpg-1734185519405.jpg",
            "https://qualzen-store.s3.amazonaws.com/baggy-shirt-4.jpg-1734185519407.jpg",
          ],
          status: "Comming soon",
          tags: ["Baggy", "Shirt", "Cotton", "Unisex"],
          createdAt: {
            $date: "2024-12-14T14:11:59.754Z",
          },
          updatedAt: {
            $date: "2024-12-14T14:11:59.754Z",
          },
          __v: 0,
        },
      ]);
    }, 1000);
  });
}