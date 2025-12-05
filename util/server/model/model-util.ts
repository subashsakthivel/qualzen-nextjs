import ObjectUtil from "@/util/ObjectUtil";
import R2API from "../file/S3Util";
import { ModelType } from "@/data/model-config";
import { PaginateResult } from "mongoose";

//todo: change the any later
const modelMap: Record<string, any> = {
  category: {
    files: [
      {
        format: "image/png",
        path: "image",
      },
    ],
  },
  product: {
    files: [
      {
        format: "image/png",
        path: "images",
      },
    ],
  },
};

class ModelHandler {
  static async create<K extends keyof ModelType>({
    modelName,
    docs,
    form,
  }: {
    modelName: K;
    docs: ModelType[K] | ModelType[K][];
    form: FormData;
  }) {
    const modelConfig = modelMap[modelName];
    if (modelConfig && modelConfig.files) {
      //pre check all files exist
      modelConfig.files.forEach(async (fileConfig: { format: string; path: string }) => {
        const documents = Array.isArray(docs) ? docs : [docs];
        documents.forEach((doc) => {
          const key = ObjectUtil.getValue({ obj: doc, path: fileConfig.path });
          const keys = Array.isArray(key) ? key : [key];
          keys.forEach((k) => {
            if (!form.has(k)) {
              throw new Error(`File for key ${k} is missing in form data`);
            }
          });
        });
      });
      //upload files
      modelConfig.files.forEach(async (fileConfig: { format: string; path: string }) => {
        const documents = Array.isArray(docs) ? docs : [docs];
        documents.forEach((doc) => {
          const key = ObjectUtil.getValue({ obj: doc, path: fileConfig.path });
          const keys = Array.isArray(key) ? key : [key];
          keys.forEach(async (k) => {
            const file = form.get(k) as File;
            await R2API.uploadFile(k, file);
          });
        });
      });
    }
    return docs;
  }

  static async delete<K extends keyof ModelType>({
    modelName,
    docs,
  }: {
    modelName: K;
    docs: ModelType[K] | ModelType[K][];
  }) {
    const modelConfig = modelMap[modelName];
    if (modelConfig && modelConfig.files) {
      const documents = Array.isArray(docs) ? docs : [docs];
      for (const doc of documents) {
        for (const fileConfig of modelConfig.files) {
          const key = ObjectUtil.getValue({ obj: doc, path: fileConfig.path });
          const keys = Array.isArray(key) ? key : [key];
          keys.forEach(async (k) => {
            await R2API.deleteFile(key);
          });
        }
      }
    }
    return docs;
  }

  static async getFileUrls<K extends keyof ModelType>({
    modelName,
    docs,
  }: {
    modelName: K;
    docs: ModelType[K] | ModelType[K][] | PaginateResult<ModelType[K]>;
  }) {
    const result = docs;
    docs = "docs" in result ? result.docs : docs;
    const modelConfig = modelMap[modelName];
    if (modelConfig && modelConfig.files) {
      const documents = Array.isArray(docs) ? docs : [docs];
      for (const doc of documents) {
        for (const fileConfig of modelConfig.files) {
          const key = ObjectUtil.getValue({ obj: doc, path: fileConfig.path });
          if (!key) continue;
          if (Array.isArray(key) && key.length === 0) continue;
          if (Array.isArray(key)) {
            const urls = [];
            for (const k of key) {
              const url = await R2API.getObjectUrl(k);
              urls.push(url);
            }
            ObjectUtil.setValue({ obj: doc, path: fileConfig.path, value: urls });
          } else {
            const url = await R2API.getObjectUrl(key);
            ObjectUtil.setValue({ obj: doc, path: fileConfig.path, value: url });
          }
        }
      }
    }
    return result;
  }

  static handle<K extends keyof ModelType>(
    modelName: K,
    docs: ModelType[K] | ModelType[K][],
    action: "GET" | "DELETE" | "CREATE" | "UPDATE",
    form?: FormData
  ) {
    switch (action) {
      case "GET":
        return this.getFileUrls({ modelName, docs });
      case "DELETE":
        return this.delete({ modelName, docs });
      case "CREATE":
        if (!form) throw new Error("FormData is required for CREATE action");
        return this.create({ modelName, docs, form });
      default:
        throw new Error("Invalid action");
    }
  }
}

export default ModelHandler;
