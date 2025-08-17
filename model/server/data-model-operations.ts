import { TCategory } from "@/schema/Category";
import { TProduct, TProductRes } from "@/schema/Product";
import { TProductVariant } from "@/schema/ProductVarient";
import { S3Util } from "@/util/S3Util";
import { DataUtil } from "@/util/server/data-util";
import { DBUtil } from "@/util/server/db-core";
import { TFilter } from "@/util/util-type";
import { TDataModels } from "./data-model-mappings";

const R2Instance = S3Util.getInstance();

type TProcessReq = {
  form: FormData;
  body: any;
  userId: string;
};

const DataModelOperation = {
  category: {
    CREATE: async (userId: string, form: FormData) => {
      const operation = form.get("operation") as string;
      const imageFile = form.get("image") as File;
      const data = JSON.parse(form.get("data") as string) as TCategory;
      const image = await R2Instance.uploadFile(imageFile);
      data.image = image;
      const cacheKey = "category-list"; // todo : need map for this
      const callback = async () =>
        await DBUtil.postData<TCategory>({ modelName: "category", operation, data });
      const onFailure = async () => await R2Instance.deleteFile(image);
      const onSuccess = () => localStorage.delete(cacheKey);
      return await execute<Promise<TCategory>, void, Promise<void>>(
        userId,
        callback,
        onSuccess,
        onFailure
      );
    },
    UPDATE: async (userId: string, req: FormData | any) => {
      const { data, operation, id, filter } = getUpdateReqParams<TCategory>(req);
      let onFailure;
      let cacheKey = "category-list";
      if (data instanceof FormData) {
        const imageFile = data.get("image") as File;
        if (imageFile) {
          const image = await R2Instance.uploadFile(imageFile);
          data.image = image;
          onFailure = async () => await R2Instance.deleteFile(image);
        }
      }
      const callback = async () =>
        await DBUtil.updateData<TCategory>({
          modelName: "category",
          operation,
          data,
          id,
          filter,
        });
      const onSuccess = () => localStorage.delete(cacheKey);
      return execute(userId, callback, onSuccess, onFailure);
    },
  },
  product: {
    CREATE: async (userId: string, from: FormData) => {
      const operation = from.get("operation") as string;
      const data = JSON.parse(from.get("data") as string) as TProductRes;
      data.variants = await Promise.all(
        data.variants.map(async (varaint, index) => {
          const imageFiles = from.getAll("images" + index) as File[];
          const images = await Promise.all(imageFiles.map((image) => R2Instance.uploadFile(image)));
          varaint.images = images;
          return varaint;
        })
      );
      const imageFiles = from.getAll("images") as File[];
      data.images = await Promise.all(
        imageFiles.map((imageFile) => R2Instance.uploadFile(imageFile))
      );
      const variants = await Promise.all(
        data.variants.map((variant) =>
          DBUtil.postData<TProductVariant>({
            modelName: "productVariant",
            operation,
            data: variant,
          })
        )
      );
      data.variants = variants;
      const product = await DBUtil.postData({ modelName: "product", operation, data });
      localStorage.delete("product-list");
      return product;
    },
    UPDATE: async (userId: string, req: FormData | any, modelName: TDataModels = "product") => {
      let onFailure;
      try {
        const { data, operation, id, filter } = getUpdateReqParams<TProductRes | TProductVariant>(
          req
        );
        const cacheKey = "product-list";
        if ("variants" in data && Array.isArray((data as TProductRes).variants)) {
          (data as TProductRes).variants.map(
            async (variant) =>
              await DataModelOperation.product.UPDATE(userId, {
                data: variant,
                operation,
                id: variant._id,
                modelName: "productVariant",
              })
          );
        }
        if (req instanceof FormData) {
          const imageFiles = req.getAll("images") as File[];
          if (imageFiles) {
            const images = await Promise.all(
              imageFiles.map((imageFile) => R2Instance.uploadFile(imageFile))
            );
            data.images = images;
            onFailure = async () => await R2Instance.deleteFile(image);
          }
        }

        const response = await DBUtil.updateData<TProductVariant | TProductRes>({
          modelName,
          operation,
          data,
          id,
          filter,
        });
        localStorage.delete(cacheKey);
        return response;
      } catch (err) {
        if (onFailure) onFailure();
      }
    },
  },
};

function execute<T, V, K>({
  userId,
  callback,
  onSuccess,
  onFailue,
}: {
  userId: string;
  callback: () => T;
  onSuccess: (response: T) => V | void;
  onFailue?: () => K;
}): T | undefined {
  try {
    const response = callback();
    if (response && onSuccess) {
      onSuccess(response);
    }
    return response;
  } catch (e) {
    console.log(e);
    if (onFailue) {
      try {
        onFailue();
      } catch (err) {
        console.error(err);
      }
    }
  }
}

function getUpdateReqParams<T>(req: FormData | any) {
  let data: T;
  let id: string;
  let operation: string;
  let filter: TFilter<T>;
  let onFailure;
  let cacheKey = "category-list";
  if (req instanceof FormData) {
    data = JSON.parse(req.get("data") as string) as T;
    id = req.get("id") as string;
    filter = JSON.parse(req.get("filter") as string) as TFilter<T>;
    operation = req.get("operation") as string;
  } else {
    data = req["data"];
    operation = req["operation"];
    id = req["id"];
    filter = req["filter"] as TFilter<T>;
  }
  return { data, operation, id, filter };
}
