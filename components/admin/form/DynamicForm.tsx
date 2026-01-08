"use client";
import { Controller, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { FieldRenderer } from "./FieldRenderer";
import { fetchFormMetaData, tFormConfigMeta } from "@/app/(admin)/table/[model]/modelform";
import DataClientAPI from "@/util/client/data-client-api";
import { useEffect, useState } from "react";

interface DynamicFormProps {
  model: "category" | "content" | "offer";
}

export function DynamicForm({ model }: DynamicFormProps) {
  const [formConfigMeta, setFormConfigMeta] = useState<tFormConfigMeta>();
  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
    control,
    getValues,
  } = useForm({
    resolver: formConfigMeta?.schema ? zodResolver(formConfigMeta.schema) : undefined,
  });

  useEffect(() => {
    const formConfigData = async () => {
      const res = await fetchFormMetaData(model);
      setFormConfigMeta(res);
    };
    formConfigData();
  }, [model]);

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

  const onSubmit = async (data: any) => {
    const transformedData = buildTranformedObject(data, formConfigMeta!);
    const response = await DataClientAPI.saveData({
      modelName: model,
      request: {
        transformedData,
        operation: "SAVE_DATA",
      },
    });
    if (response.success) {
      const imageFields = formConfigMeta!.fields.filter((field) => field.type === "image");
      await Promise.all(
        imageFields.map((field) => {
          const file = data[field.name];
          uploadFile(response.data, file);
        })
      );
    } else {
      throw new Error(response.message);
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
    <form
      onSubmit={handleSubmit(onSubmit)}
      className="min-w-full items-center justify-center flex flex-col text-left m-10"
    >
      <div className="w-[50vw]  border p-10">
        {formConfigMeta?.fields.map((field) => (
          <div
            key={field.name}
            style={{ marginBottom: 16 }}
            className="w-full grid grid-cols-[1fr_3fr] gap-y-2"
          >
            <FieldRenderer
              field={field}
              register={register}
              setValue={setValue}
              getValues={getValues}
            />
            {errors[field.name] && (
              <p style={{ color: "red" }}>{String(errors[field.name]?.message)}</p>
            )}
          </div>
        ))}
      </div>
      <button type="submit">Submit</button>
    </form>
  );
}
