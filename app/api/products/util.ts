import dbConnect from "@/lib/mongoose";
import { IProduct, Product, productSchema } from "@/model/Product";
import { ErrorRequest } from "@/utils/responseUtil";
import { S3Util } from "@/utils/S3Util";
import { Types } from "mongoose";

async function fetchAllProducts() {
  try {
    await dbConnect();
    const product = await Product.find();
    return product;
  } catch (err) {
    console.error("Error fetching product:", err);
    throw err;
  }
}

async function fetchProductsWithPagination(page: number, limit: number) {
  try {
    const product = await Product.find()
      .skip((page - 1) * limit)
      .limit(limit);

    return product;
  } catch (err) {
    console.error("Error fetching paginated product:", err);
    throw err;
  }
}

async function fetchProductById(id: string) {
  try {
    const product = await Product.findById(id);
    if (!product) {
      return null;
    }
    return product;
  } catch (err) {
    console.error("Error fetching product by ID:", err);
    throw err;
  }
}

async function fetchProductsByFilter(filter: { name?: string; category?: string }) {
  try {
    const products = await Product.find(filter);
    return products;
  } catch (err) {
    console.error("Error fetching filtered products:", err);
    throw err;
  }
}

async function fetchProductsWithPaginationAndTotal(page: number, limit: number) {
  try {
    const skip = (page - 1) * limit;
    const aggregationPipeline = [
      {
        $facet: {
          data: [{ $skip: skip }, { $limit: limit }],
          totalCount: [{ $count: "count" }],
        },
      },
    ];
    const result = await Product.aggregate(aggregationPipeline).exec();

    const product: IProduct[] = result[0].data;
    const totalDocuments: number = result[0].totalCount[0]?.count || 0;
    const totalPages: number = Math.ceil(totalDocuments / limit);

    return {
      product,
      totalDocuments,
      totalPages,
      currentPage: page,
    };
  } catch (err) {
    console.error("Error fetching product with $facet:", err);
    throw err;
  }
}

async function insertProduct(product: IProduct) {
  try {
    const newProduct = new Product(product);
    newProduct.save();
  } catch (err) {
    console.error("Error inserting product : ", err);
    throw err;
  }
}

async function updateProduct(id: string, updateDoc: IProduct) {
  await dbConnect();
  try {
    const productId = new Types.ObjectId(id);
    const updatedProduct = await Product.findByIdAndUpdate(
      productId,
      { $set: updateDoc },
      { new: true, runValidators: true } // Return the updated document
    );

    if (!updatedProduct) {
      throw new Error("Product not found");
    }

    console.log("Product updated:", updatedProduct);
    return updatedProduct;
  } catch (err) {
    console.error("Error updating product:", err);
    throw err;
  }
}

async function deleteProduct(id: string) {
  try {
    const productId = new Types.ObjectId(id);
    const deletedProduct = await Product.findByIdAndDelete(productId);

    if (!deletedProduct) {
      throw new Error("Product not found");
    }

    console.log("Product deleted:", deletedProduct);
    return deletedProduct;
  } catch (err) {
    console.error("Error deleting product:", err);
    throw err;
  }
}

export async function handleGetOperation(operation: string | null, params: URLSearchParams) {
  switch (operation) {
    case "fetchAll":
      return fetchAllProducts();
    case "fetchByFilter": {
      const filterparam = params.get("filter");
      if (!filterparam) throw new ErrorRequest("Bad Request", 400);
      return fetchProductsByFilter(JSON.parse(decodeURIComponent(filterparam)));
    }
    case "fetchById":
      const id = params.get("id");
      if (!id) throw new ErrorRequest("Bad Request", 400);
      return fetchProductById(id);

    case "fetchWithPaginationAndTotal":
      const page = params.get("pageIndex");
      const limit = params.get("pageLimit");
      if (!page || !limit) throw new ErrorRequest("Page and limit not mentioned", 400);
      return fetchProductsWithPaginationAndTotal(parseInt(page), parseInt(limit));
    default:
      return fetchAllProducts();
  }
}

export async function handlePostOperation(operation: string, form: FormData) {
  if (operation === "save") {
    const productData = productSchema.parse(form.get("productData") as string);

    const imageCount = parseInt((form.get("imageCount") || "0") as string);
    const imageList: File[] = [];

    for (let i = 0; i < imageCount; i++) {
      imageList.push(form.get(`image[${i}]`) as File);
    }
    const images = await S3Util.getInstance().uploadFiles(imageList);

    try {
      const imageList = Array.isArray(images) ? images : [images];
      await insertProduct({ ...productData, images: imageList });
    } catch (err) {
      S3Util.getInstance().deleteFiles(images);
      throw err;
    }
    return;
  }
  throw new ErrorRequest("Bad Request", 400);
}

export async function handlePutOperation(operation: string, form: FormData) {
  if (operation === "edit") {
    const data = JSON.parse(form.get("productData") as string);

    if (!data._id) return;

    if (data.imageSrc) {
      await S3Util.getInstance().deleteFiles(data.oldImages);
      const image = await S3Util.getInstance().uploadFiles(data.imageSrc);

      if (Array.isArray(image)) {
        throw new ErrorRequest("unexpected type error", 504);
      }

      try {
        await updateProduct(data._id, { ...data.category, image });
      } catch (err) {
        await S3Util.getInstance().deleteFiles(image);
        throw err;
      }
      return;
    }

    await updateProduct(data._id, { ...data.category });
    return;
  }
  throw new ErrorRequest("Bad Request", 400);
}

export {
  fetchAllProducts,
  fetchProductById,
  fetchProductsWithPagination,
  fetchProductsWithPaginationAndTotal,
  insertProduct,
  updateProduct,
  deleteProduct,
};
