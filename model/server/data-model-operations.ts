import { TCategory } from "@/schema/Category";
import { TProduct } from "@/schema/Product";
import { TProductVariant } from "@/schema/ProductVarient";
import { S3Util } from "@/util/S3Util";
import { DBUtil } from "@/util/server/db-core";
import { TFilter } from "@/util/util-type";
import { TDataModels } from "./data-model-mappings";

const R2Instance = S3Util.getInstance();

/** 🔹 Maps cache keys per model */
const CacheKeys: Record<TDataModels, string> = {
  category: "category-list",
  product: "product-list",
  productVariant: "product-variant-list",
  address: "address-list",
  content: "content-lis",
  order: "orde",
  base: "",
  userinfo: "",
};

/** 🔹 Centralized execution handler */
async function execute<T>({
  userId,
  callback,
  onSuccess,
  onFailure,
}: {
  userId: string;
  callback: () => Promise<T>;
  onSuccess?: (response: T) => void | Promise<void>;
  onFailure?: () => void | Promise<void>;
}): Promise<T | undefined> {
  try {
    const response = await callback();
    if (onSuccess) await onSuccess(response);
    return response;
  } catch (err) {
    console.error(userId, "Execution error:", err);
    if (onFailure) await onFailure();
  }
}

/** 🔹 Utility: parse request data */
function getUpdateReqParams<T>(req: FormData | any) {
  if (req instanceof FormData) {
    return {
      data: JSON.parse(req.get("data") as string) as T,
      id: req.get("id") as string,
      operation: req.get("operation") as string,
      filter: JSON.parse(req.get("filter") as string) as TFilter<T>,
    };
  }
  return {
    data: req.data as T,
    id: req.id as string,
    operation: req.operation as string,
    filter: req.filter as TFilter<T>,
  };
}

/** 🔹 Utility: upload multiple files */
async function uploadFiles(files: File[]): Promise<string[]> {
  return Promise.all(files.map((file) => R2Instance.uploadFile(file)));
}

async function deleteFiles(files: File[]) {
  Promise.all(files.map((file) => R2Instance.uploadFile(file)));
}

/** 🔹 Core Operations */
const DataModelOperation = {
  category: {
    CREATE: async (userId: string, form: FormData) => {
      const operation = form.get("operation") as string;
      const imageFile = form.get("image") as File;
      const data = JSON.parse(form.get("data") as string) as TCategory;

      const image = await R2Instance.uploadFile(imageFile);
      data.image = image;

      return execute({
        userId,
        callback: () => DBUtil.postData<TCategory>({ modelName: "category", operation, data }),
        onSuccess: () => localStorage.delete(CacheKeys.category),
        onFailure: () => R2Instance.deleteFile(image),
      });
    },

    UPDATE: async (userId: string, req: FormData | any) => {
      const { data, operation, id, filter } = getUpdateReqParams<TCategory>(req);
      let uploadedImage: string | null = null;

      if (req instanceof FormData) {
        const imageFile = req.get("image") as File;
        if (imageFile) {
          uploadedImage = await R2Instance.uploadFile(imageFile);
          (data as any).image = uploadedImage;
        }
      }

      return execute({
        userId,
        callback: () =>
          DBUtil.updateData<TCategory>({ modelName: "category", operation, data, id, filter }),
        onSuccess: () => localStorage.delete(CacheKeys.category),
        onFailure: () => {
          if (uploadedImage) R2Instance.deleteFile(uploadedImage);
        },
      });
    },
  },

  product: {
    CREATE: async (userId: string, form: FormData) => {
      const operation = form.get("operation") as string;
      const data = JSON.parse(form.get("data") as string) as TProduct;

      // Upload images for each variant
      if (data.variants) {
        const variants = await Promise.all(
          data.variants.map(async (variant, index) => {
            const formData: FormData = new FormData();
            formData.append("data", JSON.stringify(variant));
            const images = form.getAll("images" + index) as File[];
            if (images && images.length > 0) {
              images.forEach((image) => {
                formData.append("images", image);
              });
            }
            return DataModelOperation.productVariant.CREATE(userId, form);
          })
        );
        if (variants) {
          data.variants = variants as TProductVariant[];
        }
      }
      const imageFiles = form.getAll("images") as File[];
      data.images = await uploadFiles(imageFiles);

      const product = await DBUtil.postData({ modelName: "product", operation, data });
      localStorage.delete(CacheKeys.product);
      localStorage.delete(CacheKeys.productVariant);
      return product;
    },
  },
  productVariant: {
    CREATE: async (userId: string, form: FormData) => {
      const operation = form.get("operation") as string;
      const imageFiles = form.getAll("images") as File[];
      const data = JSON.parse(form.get("data") as string) as TProductVariant;

      const images = await uploadFiles(imageFiles);
      data.images = images;

      return execute({
        userId,
        callback: () =>
          DBUtil.postData<TProductVariant>({ modelName: "productVariant", operation, data }),
        onSuccess: () => localStorage.delete(CacheKeys.category),
        onFailure: () => deleteFiles(imageFiles),
      });
    },
  },
};
