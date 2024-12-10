import dbConnect from "@/lib/mongoose";
import { Category, ICategory } from "@/model/Category";
import { ErrorRequest } from "@/utils/responseUtil";
import { S3Util } from "@/utils/S3Util";
import { randomUUID } from "crypto";
import { Types } from "mongoose";

async function fetchAllCategories() {
  try {
    await dbConnect();
    const categories = await Category.find();
    console.log("Categories:", categories);
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

    console.log("Paginated Categories:", categories);
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
      console.log("Category not found");
      return null;
    }
    console.log("Category:", category);
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
    console.log("All category names:", categoryData);
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

//network util function
export function getCategoryObject(form: FormData) {
  const name = form.get("name") as string;
  const imageSrc = form.get("imageSrc") as File;
  const description = form.get("description") as string;
  const properties = form.getAll("properties") as string[];
  const parentCategory = form.get("parentCategory")
    ? (JSON.parse(form.get("parentCategory") as string) as ICategory)
    : undefined;
  const oldImage = form.get("oldImage") as string;
  const isActive = form.get("isActive") ? true : false;
  const id = (form.get("id") ?? randomUUID()) as string;
  const _id = form.get("_id") as string | undefined | null;

  return {
    category: {
      name,
      description,
      properties,
      parentCategory,
      isActive,
      id,
    },
    imageSrc,
    oldImage,
    _id,
  };
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
    const categoryData = JSON.parse(form.get("categoryData") as string);

    if (categoryData.parentCategory === "None" || categoryData.parentCategory === "") {
      categoryData.parentCategory = undefined;
    }
    const image = await S3Util.getInstance().uploadFiles(form.get("image") as File);

    if (Array.isArray(image)) {
      throw new ErrorRequest("unexpected type error", 504);
    }

    try {
      await insertCategory({ ...categoryData, image });
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
    const data = getCategoryObject(form);
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
