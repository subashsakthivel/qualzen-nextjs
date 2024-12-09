import dbConnect from "@/lib/mongoose";
import { ICategory } from "@/model/Category";
import { Product, IProduct, IProductDetails, ProductDetails } from "@/model/Product";
import { IProperty } from "@/utils/VTypes";
import { NextRequest, NextResponse } from "next/server";
import { uploadImage } from "../upload/route";
import { ProdcutStatus } from "@/utils/Enums";
import { ErrorRequest } from "@/utils/responseUtil";
import {
  fetchAllProducts,
  fetchAllProductsWithDetails,
  fetchProductById,
  fetchProductsByFilter,
  fetchProductsWithPaginationAndTotal,
} from "./util";

export async function GET(request: NextRequest) {
  const params = request.nextUrl.searchParams;

  try {
    const operation = params.get("operation");

    const data = (() => {
      switch (operation) {
        case "fetchAll":
          return fetchAllProducts();
        case "fetchAllWithDetails":
          return fetchAllProductsWithDetails();
        case "fetchByFilter":
          const filterparam = params.get("filter");
          if (filterparam === null) {
            throw new ErrorRequest("Bad Request", 400);
          }
          const filter = JSON.parse(decodeURIComponent(filterparam));
          return fetchProductsByFilter(filter);
        case "fetchById":
          const id = params.get("id");
          if (id === null) {
            throw new ErrorRequest("Bad Request", 400);
          }
          return fetchProductById(id);
        case "fetchWithPaginationAndTotal":
          const page = params.get("pageIndex");
          const limit = params.get("pageLimit");
          if (page === null || limit === null) {
            throw new ErrorRequest("Page and limit not mentioned", 400);
          }
          return fetchProductsWithPaginationAndTotal(parseInt(page), parseInt(limit));
        default:
          throw new ErrorRequest("No operation mentioned", 400);
      }
    })();

    return NextResponse.json(
      {
        message: "all good",
        data,
      },
      { status: 200 }
    );
  } catch (err) {
    if (err instanceof ErrorRequest) {
      return NextResponse.json({
        message: err.message,
        status: err.statusCode,
      });
    }
    return NextResponse.json({ error: "somthing is bad", status: 500 });
  }
}

export async function POST(request: Request) {
  await dbConnect();

  const form = await request.formData();
  const name = form.get("title") as string;
  const description = form.get("description") as string;
  const imageSrc = form.getAll("imageSrc") as File[];
  const category = JSON.parse(form.get("category") as string) as ICategory;
  const marketPrice = Number(form.get("marketPrice") as string);
  const sellingPrice = Number(form.get("sellingPrice") as string);
  const status = form.get("status") as ProdcutStatus;
  const careInstructions = form.get("careInstructions") as string;
  const color = JSON.parse(form.get("color") as string) as string[];
  const details = form.get("careInstructions") as string;
  const size = JSON.parse(form.get("size") as string) as string[];
  const marginPrice = Number(form.get("marginPrice") as string);
  const expiryDate = new Date(Number(form.get("marginPrice") as string)).getDate();

  const properties = JSON.parse(form.get("properties") as string) as IProperty[];

  console.log("---PRODUCT POST---");
  await uploadImage(imageSrc)
    .then(async (imageSrc) => {
      if (imageSrc === undefined || !imageSrc[0]) {
        NextResponse.json({ message: "Image Upload failed" }, { status: 500 });
        return;
      }
      const product: IProduct = {
        name,
        category,
        description,
        imageSrc,
        variations: [],
        isActive: true,
        tags: [],
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      await Product.create(product).then(async (res) => {
        const productDetails = {
          createdAt: Date.now(),
          expiryDate,
          marginPrice,
          product,
        };

        await ProductDetails.create(productDetails).then((res) => {
          console.log("Product Created Response : ", res);
          NextResponse.json({ message: "New Product created", response: res }, { status: 200 });
        });
      });
    })
    .catch((err) => {
      console.log("Error Occured while creating new Product ", err);
      return NextResponse.json({ message: "New Product Not created" }, { status: 400 });
    });
}

async function getPageData(pageIndex: number, pageLimit: number) {
  if (pageLimit > 100) {
    pageLimit = 100;
  }
  if (pageIndex < 0) {
    pageIndex = 0;
  }
  try {
    const products = await Product.aggregate([
      {
        $facet: {
          totalDoc: [
            {
              $group: {
                _id: null,
                count: { $sum: 1 },
              },
            },
          ],
          data: [{ $match: {} }, { $skip: pageIndex * pageLimit }, { $limit: pageLimit }],
        },
      },
    ]);
    return NextResponse.json({
      hasMore: products.length <= 0,
      products: JSON.stringify(products),
    });
    // } else {
    //   const categories = await Product.find()
    //     .skip(pageIndex! * pageLimit!)
    //     .limit(pageLimit!);
    //   return NextResponse.json(JSON.stringify(categories));
    // }
  } catch (err: any) {
    return NextResponse.json({ error: err.message });
  }
}
