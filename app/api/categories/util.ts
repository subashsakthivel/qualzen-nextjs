import dbConnect from "@/lib/mongoose";
import { Category, categorySchema, ICategory } from "@/model/Category";
import { ErrorRequest } from "@/utils/responseUtil";
import { S3Util } from "@/utils/S3Util";
import { randomUUID } from "crypto";
import { Types } from "mongoose";

async function fetchAllCategories() {
  try {
    await dbConnect();
    const categories = await Category.find();
    return categories;
  } catch (err) {
    console.error("Error fetching categories:", err);
    throw err;
  }
}

async function fetchCategoriesWithSubcategories() {
  try {
    const categories = await Category.find().populate("parentCategory");
    console.log("Categories with Subcategories:", categories);
    return categories;
  } catch (err) {
    console.error("Error fetching categories with subcategories:", err);
    throw err;
  }
}

async function fetchCategoriesWithPagination(page: number, limit: number) {
  try {
    const categories = await Category.find()
      .skip((page - 1) * limit)
      .limit(limit);

    return categories;
  } catch (err) {
    console.error("Error fetching paginated categories:", err);
    throw err;
  }
}

async function fetchCategoryById(id: string) {
  try {
    const category = await Category.findById(id);
    if (!category) {
      return null;
    }
    return category;
  } catch (err) {
    console.error("Error fetching category by ID:", err);
    throw err;
  }
}

async function fetchCategoriesByFilter(filter: {
  name?: string;
  isActive?: boolean;
  parentCategory?: string;
}) {
  try {
    const categories = await Category.find(filter);
    console.log("Filtered Categories:", categories);
    return categories;
  } catch (err) {
    console.error("Error fetching filtered categories:", err);
    throw err;
  }
}

async function fetchCategoriesWithPaginationAndTotal(page: number, limit: number) {
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
    const result = await Category.aggregate(aggregationPipeline).exec();

    const categories: ICategory[] = result[0].data;
    const totalDocuments: number = result[0].totalCount[0]?.count || 0;
    const totalPages: number = Math.ceil(totalDocuments / limit);

    return {
      categories,
      totalDocuments,
      totalPages,
      currentPage: page,
    };
  } catch (err) {
    console.error("Error fetching categories with $facet:", err);
    throw err;
  }
}
async function fetchAllCategoryNames() {
  await dbConnect();
  try {
    const categories = await Category.find({}, "name _id");
    const categoryData = categories.map((category) => ({
      name: category.name,
      _id: category._id,
    }));
    return categoryData;
  } catch (err) {
    console.error("Error fetching category names:", err);
    throw err;
  }
}

async function insertCategory(category: ICategory) {
  await dbConnect();
  try {
    const newCategory = new Category(category);
    newCategory.save();
  } catch (err) {
    console.error("Error inserting category : ", err);
    throw err;
  }
}

async function updateCatogory(id: string, updateDoc: ICategory) {
  await dbConnect();
  try {
    const categoryId = new Types.ObjectId(id);
    const updatedCategory = await Category.findByIdAndUpdate(
      categoryId,
      { $set: updateDoc },
      { new: true, runValidators: true } // Return the updated document
    );

    if (!updatedCategory) {
      throw new Error("Category not found");
    }

    console.log("Category updated:", updatedCategory);
    return updatedCategory;
  } catch (err) {
    console.error("Error updating category:", err);
    throw err;
  }
}

async function deleteCatogory(id: string) {
  await dbConnect();
  try {
    const categoryId = new Types.ObjectId(id);
    const deletedCategory = await Category.findByIdAndDelete(categoryId);

    if (!deletedCategory) {
      throw new Error("Category not found");
    }

    console.log("Category deleted:", deletedCategory);
    return deletedCategory;
  } catch (err) {
    console.error("Error deleting category:", err);
    throw err;
  }
}

export async function handleGetOperation(operation: string | null, params: URLSearchParams) {
  switch (operation) {
    case "fetchAll":
      return fetchAllCategories();
    case "fetchAllWithSubDocs":
      return fetchCategoriesWithSubcategories();
    case "fetchByFilter": {
      const filterparam = params.get("filter");
      if (!filterparam) throw new ErrorRequest("Bad Request", 400);
      return fetchCategoriesByFilter(JSON.parse(decodeURIComponent(filterparam)));
    }
    case "fetchById": {
      const id = params.get("id");
      if (!id) throw new ErrorRequest("Bad Request", 400);
      return fetchCategoryById(id);
    }
    case "fetchWithPaginationAndTotal": {
      const page = params.get("pageIndex");
      const limit = params.get("pageLimit");
      if (!page || !limit) throw new ErrorRequest("Page and limit not mentioned", 400);
      return fetchCategoriesWithPaginationAndTotal(parseInt(page), parseInt(limit));
    }
    default:
      return fetchAllCategoryNames();
  }
}

export async function handlePostOperation(operation: string, form: FormData) {
  if (operation === "save") {
    const categoryData = categorySchema.parse(form.get("categoryData"));

    if (categoryData.parentCategory === "None" || categoryData.parentCategory === "") {
      categoryData.parentCategory = undefined;
    }
    const image = await S3Util.getInstance().uploadFiles(form.get("image") as File);
    const imageString = Array.isArray(image) ? image[0] : image;
    try {
      await insertCategory({ ...categoryData, image: imageString });
    } catch (err) {
      S3Util.getInstance().deleteFiles(image);
      throw err;
    }
    return;
  }
  throw new ErrorRequest("Bad Request", 400);
}

export async function handlePutOperation(operation: string, form: FormData) {
  if (operation === "edit") {
    const data = JSON.parse(form.get("categoryData") as string);
    if (!data._id) return;

    if (data.imageSrc) {
      await S3Util.getInstance().deleteFiles(data.oldImage);
      const image = await S3Util.getInstance().uploadFiles(data.imageSrc);

      if (Array.isArray(image)) {
        throw new ErrorRequest("unexpected type error", 504);
      }

      try {
        await updateCatogory(data._id, { ...data.category, image });
      } catch (err) {
        await S3Util.getInstance().deleteFiles(image);
        throw err;
      }
      return;
    }

    await updateCatogory(data._id, { ...data.category });
    return;
  }
  throw new ErrorRequest("Bad Request", 400);
}

export {
  fetchAllCategories,
  fetchCategoriesByFilter,
  fetchCategoriesWithPagination,
  fetchCategoriesWithPaginationAndTotal,
  fetchCategoriesWithSubcategories,
  fetchCategoryById,
  fetchAllCategoryNames,
  insertCategory,
  updateCatogory,
  deleteCatogory,
};
