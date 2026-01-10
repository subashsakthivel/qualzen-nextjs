"use client";
import { Controller, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { FieldRenderer } from "./FieldRenderer";
import { getFormMetaData, tFormConfigMeta } from "@/app/(admin)/table/[model]/modelform";
import DataClientAPI from "@/util/client/data-client-api";
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import ObjectUtil from "@/util/ObjectUtil";
import { v4 as uuidv4 } from "uuid";

interface DynamicFormProps {
  model: "category" | "content" | "offer";
}

export function DynamicForm({ model }: DynamicFormProps) {
  const [formConfigMeta, setFormConfigMeta] = useState<tFormConfigMeta>(getFormMetaData(model));
  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
    watch,
    control,
    getValues,
  } = useForm({
    resolver: formConfigMeta?.schema ? zodResolver(formConfigMeta.schema) : undefined,
  });

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
    debugger;
    console.log(data);
    const transformedData = buildTranformedObject(data, formConfigMeta!);
    const imageFields = formConfigMeta!.fields.filter((field) => field.type === "image");
    imageFields.map((field) =>
      ObjectUtil.setValue({ obj: transformedData, path: field.path, value: uuidv4() })
    );
    console.log(transformedData);
    // const response = await DataClientAPI.saveData({
    //   modelName: model,
    //   request: {
    //     transformedData,
    //     operation: "SAVE_DATA",
    //   },
    // });
    // if (response.success) {
    //   debugger;
    //   const imageFields = formConfigMeta!.fields.filter((field) => field.type === "image");
    //   await Promise.all(
    //     imageFields.map((field) => {
    //       const files = data[field.name] as File[];
    //       files.map(async (file) => await uploadFile(response.data, file));
    //     })
    //   );
    // } else {
    //   throw new Error(response.message);
    // }
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
      className="min-w-full items-center justify-center flex flex-col text-left m-10 pb-10"
    >
      <div className="w-[50vw]  border p-10">
        {formConfigMeta?.fields.map((field) => (
          <div key={field.name}>
            <div
              key={field.name}
              style={{ marginBottom: 16 }}
              className="w-full grid grid-cols-[0.5fr_2fr] gap-y-2"
            >
              <label className="items-center">{field.displayName ?? field.name}</label>
              <FieldRenderer
                field={field}
                register={register}
                setValue={setValue}
                watch={watch}
                control={control}
              />
              {errors[field.name] && (
                <div className="col-span-2">
                  <p className="text-red-900 overflow-auto text-right">
                    {String(errors[field.name]?.message)}
                  </p>
                </div>
              )}
            </div>
          </div>
        ))}
        <div className="w-full justify-end mt-10">
          <Button type="submit">Submit</Button>
        </div>
      </div>
    </form>
  );
}
