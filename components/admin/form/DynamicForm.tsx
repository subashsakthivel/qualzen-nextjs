"use client";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { FieldRenderer } from "./components/input-field-render";
import { getFormMetaData, tFormConfigMeta } from "@/app/(admin)/table/[model]/modelform";
import DataClientAPI from "@/util/client/data-client-api";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import ObjectUtil from "@/util/ObjectUtil";
import { v4 as uuidv4 } from "uuid";
import { tDataModels } from "@/util/util-type";
import FormRender from "./components/form-render";

interface DynamicFormProps {
  model: tDataModels; //"category" | "content" | "offer"
}

export function DynamicForm({ model }: DynamicFormProps) {
  const [error, SetError] = useState<string | undefined>(undefined);
  const [imageFiles, setImageFiles] = useState<File[]>([]);
  const formConfigMeta = getFormMetaData(model);
  const {
    register,
    handleSubmit,
    formState: { errors },

    control,
  } = useForm({
    resolver: formConfigMeta?.schema ? zodResolver(formConfigMeta.schema) : undefined,
  });

  const onSubmit = async (data: any) => {
    debugger;
    SetError(undefined);
    const requestData = {} as any;
    formConfigMeta!.fields.map((field) => {
      if (field.type === "tags") {
        requestData[field.name] = data[field.name].split(",").map((tag: string) => tag.trim());
      } else {
        requestData[field.name] = data[field.name];
      }
    });
    const imageFields = formConfigMeta!.fields.filter(
      (field) => field.type === "image" || field.type == "images",
    );
    imageFields.map((field) => {
      if (field.type == "images") {
        debugger;
        const images: File[] = ObjectUtil.getValue({
          obj: data,
          path: field.path,
        });

        const value = Array.from({ length: images.length }).map((_, index) => uuidv4());
        ObjectUtil.setValue({
          obj: requestData,
          path: field.path,
          value: value,
        });
      } else {
        ObjectUtil.setValue({
          obj: requestData,
          path: field.path,
          value: uuidv4(),
        });
      }
    });

    console.log(requestData);
    const response = await DataClientAPI.saveData({
      modelName: model,
      request: {
        data: requestData,
        operation: "SAVE_DATA",
      },
    });
    if (response.success) {
      debugger;
      const imageFields = formConfigMeta!.fields.filter(
        (field) => field.type === "image" || field.type === "images",
      );

      imageFields.map(async (field) => {
        const files = Array.isArray(data[field.name])
          ? (data[field.name] as File[])
          : ([data[field.name]] as File[]);
        await Promise.all(files.map((file) => uploadFile(response.data, file)));
      });
    } else {
      SetError(response.message ?? "Something not correct, please try again later.");
    }
  };

  async function uploadFile(data: any, imageFile: File) {
    try {
      if (imageFile instanceof File) {
        console.log(imageFile);
      }

      const response = await fetch("/api/upload", {
        method: "POST",
        body: JSON.stringify({
          modelName: model,
          id: data._id,
          fileType: imageFile.type,
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
    } catch (err) {
      SetError(`Error while uploading image ${imageFile.name}`);
    }
  }

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className="min-w-full items-center justify-center flex flex-col text-left m-10 pb-10"
      autoComplete="true"
    >
      <div className="w-[50vw]  border p-10">
        <FormRender
          control={control}
          errors={errors}
          fields={formConfigMeta["fields"]}
          register={register}
          name=""
        />
        {/* <input {...register("attributes.0.name")} /> */}
        <div className="w-full justify-center mt-10 grid grid-cols-4 items-start">
          <Button type="submit">Submit</Button>
          {error && (
            <span className="w-80 border p-2 ml-10 text-red-600 rounded-md text-wrap col-span-3 text-sm">
              - {error}
            </span>
          )}
        </div>
      </div>
    </form>
  );
}
