import dbConnect from "@/lib/mongoose";
import {
  IProduct,
  IProductDetails,
  Product,
  ProductDetails,
} from "@/model/Product";
import { Types } from "mongoose";

async function fetchAllProducts() {
  try {
    const product = await Product.find();
    console.log("Product:", product);
    return product;
  } catch (err) {
    console.error("Error fetching product:", err);
    throw err;
  }
}

async function fetchAllProductsWithDetails() {
  try {
    const productDetails = await ProductDetails.find().populate("product");
    console.log("ProductDetails:", productDetails);
    return productDetails;
  } catch (err) {
    console.error("Error fetching product details:", err);
    throw err;
  }
}

async function fetchProductsWithPagination(page: number, limit: number) {
  try {
    const product = await Product.find()
      .skip((page - 1) * limit)
      .limit(limit);

    console.log("Paginated Product:", product);
    return product;
  } catch (err) {
    console.error("Error fetching paginated product:", err);
    throw err;
  }
}

async function fetchProductsWithDetailsAndPagination(
  page: number,
  limit: number
) {
  try {
    const product = await ProductDetails.find()
      .populate("product")
      .skip((page - 1) * limit)
      .limit(limit);

    console.log("Paginated ProductDetails:", product);
    return product;
  } catch (err) {
    console.error("Error fetching paginated products with details:", err);
    throw err;
  }
}

async function fetchProductById(id: string) {
  try {
    const product = await Product.findById(id);
    if (!product) {
      console.log("Product not found");
      return null;
    }
    console.log("Product:", product);
    return product;
  } catch (err) {
    console.error("Error fetching product by ID:", err);
    throw err;
  }
}

async function fetchProductWithDetailsById(id: string) {
  try {
    const product = await ProductDetails.findById(id).populate("product");
    if (!product) {
      console.log("Product not found");
      return null;
    }
    console.log("Product:", product);
    return product;
  } catch (err) {
    console.error("Error fetching product by ID:", err);
    throw err;
  }
}

async function fetchProductsByFilter(filter: {
  name?: string;
  variations?: [
    {
      attributes?: [
        {
          key: string;
          value: string[];
        }
      ];
      sellPrice?: number;
      status?: string;
    }
  ];
}) {
  try {
    const product = await Product.find(filter);
    console.log("Filtered Product:", product);
    return product;
  } catch (err) {
    console.error("Error fetching filtered product:", err);
    throw err;
  }
}

async function fetchProductsWithPaginationAndTotal(
  page: number,
  limit: number
) {
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

//network util function
export function getProductObject(form: FormData) {
  const name = form.get("name") as string;
  const imageFile = form.get("imageFile") as File;
  const description = form.get("description") as string;
  const properties = form.getAll("properties") as string[];
  const parentCategory = JSON.parse(
    form.get("parentCategory") as string
  ) as IProduct;
  const oldImage = form.get("oldImage") as string;
  const isActive = (form.get("isActive") || true) as boolean;
  const id = form.get("id") as string;
  return {
    product: {
      name,
      description,
      properties,
      parentCategory,
      isActive,
    },
    imageFile,
    oldImage,
    id,
  };
}

export {
  fetchAllProducts,
  fetchProductsByFilter,
  fetchProductById,
  fetchAllProductsWithDetails,
  fetchProductWithDetailsById,
  fetchProductsWithDetailsAndPagination,
  fetchProductsWithPagination,
  fetchProductsWithPaginationAndTotal,
  insertProduct,
  updateProduct,
  deleteProduct,
};
