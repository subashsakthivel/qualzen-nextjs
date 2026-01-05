import React from "react";
import { fetchFormMetaData, tFormConfigMeta } from "../../table/[model]/modelform";
import { DynamicForm } from "@/components/admin/form/DynamicForm";
import DataClientAPI from "@/util/client/data-client-api";

function buildTranformedObject(flat: Record<string, any>, configMeta: tFormConfigMeta) {
  const result: Record<string, any> = {};

  for (const { name, path } of configMeta.fields) {
    const value = flat[name];
    if (value === undefined) continue;

    const keys = path.split(".");
    let current = result;

    keys.forEach((key, index) => {
      if (index === keys.length - 1) {
        current[key] = value;
      } else {
        current[key] ??= {};
        current = current[key];
      }
    });
  }

  return result;
}
export default async function Form({
  params,
}: {
  params: Promise<{ model: "category" | "content" | "offer" }>;
}): Promise<JSX.Element> {
  const { model } = await params;

  const formConfigData = await fetchFormMetaData(model);

  const onSubmit = async (data: any) => {
    const transformedData = buildTranformedObject(data, formConfigData);
    const response = await DataClientAPI.saveData({
      modelName: model,
      request: {
        transformedData,
        operation: "SAVE_DATA",
      },
    });
    if (response.success) {
      const imageFields = formConfigData.fields.filter((field) => field.type === "image");
      await Promise.all(
        imageFields.map((field) => {
          const file = data[field.name];
          uploadFile(response.data, file);
        })
      );
    }
  };

  async function uploadFile(data: any, imageFile: File) {
    const response = await fetch("/api/upload", {
      method: "POST",
      body: JSON.stringify({
        modelName: model,
        id: data._id,
      }),
    });
    if (response && response.ok) {
      const responseJSon = await response.json();
      const {
        data: { uploadUrl },
      } = responseJSon as {
        data: {
          uploadUrl: string;
          key: string;
        };
      };
      await fetch(uploadUrl, {
        method: "PUT",
        body: imageFile,
      });
    }
  }

  return (
    <div>
      <DynamicForm config={formConfigData} onSubmit={onSubmit} />
    </div>
  );
}
