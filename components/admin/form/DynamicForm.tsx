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
import { setErrorMap } from "zod/v3";

interface DynamicFormProps {
  model: "category" | "content" | "offer";
}

export function DynamicForm({ model }: DynamicFormProps) {
  const [formConfigMeta, setFormConfigMeta] = useState<tFormConfigMeta>(getFormMetaData(model));
  const [error, SetError] = useState<string | undefined>(undefined);
  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
    watch,
    control,
  } = useForm({
    resolver: formConfigMeta?.schema ? zodResolver(formConfigMeta.schema) : undefined,
  });

  const onSubmit = async (data: any) => {
    SetError(undefined);
    const requestData = {} as any;
    formConfigMeta!.fields.map((field) => {
      requestData[field.name] = data[field.name];
    });
    const imageFields = formConfigMeta!.fields.filter((field) => field.type === "image");
    imageFields.map((field) =>
      ObjectUtil.setValue({ obj: requestData, path: field.path, value: uuidv4() })
    );
    console.log(requestData);
    const response = await DataClientAPI.saveData({
      modelName: model,
      request: {
        data: requestData,
        operation: "SAVE_DATA",
      },
    });
    if (response.success) {
      const imageFields = formConfigMeta!.fields.filter((field) => field.type === "image");

      imageFields.map(async (field) => {
        const files = Array.isArray(data[field.name])
          ? (data[field.name] as File[])
          : ([data[field.name]] as File[]);
        await Promise.all(files.map((file) => uploadFile(response.data, file)));
      });
    } else {
      SetError(response.message ?? "Something not correct, please wait and resubmit");
    }
  };

  async function uploadFile(data: any, imageFile: File) {
    const response = await fetch("/api/upload", {
      method: "POST",
      body: JSON.stringify({
        modelName: model,
        id: data._id,
        contentType: imageFile.type,
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
      debugger;
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
      autoComplete="true"
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
          {error && (
            <span className="w-80 border p-2 m-2 ml-10 bg-red-600 rounded-md text-white">
              {error}
            </span>
          )}
        </div>
      </div>
    </form>
  );
}
