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
import { fi } from "zod/v4/locales";
import { file } from "zod";

interface DynamicFormProps {
  model: tDataModels; //"category" | "content" | "offer"
}

export function DynamicForm({ model }: DynamicFormProps) {
  const [error, SetError] = useState<string | undefined>(undefined);
  const [status, setStatus] = useState<"idle" | "submitting" | "success" | "error">("idle");
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
    setStatus("submitting");
    const requestData = {} as any;
    formConfigMeta!.fields.map((field) => {
      if (field.type === "tags") {
        requestData[field.name] = data[field.name].split(",").map((tag: string) => tag.trim());
      } else {
        requestData[field.name] = data[field.name];
      }
    });
    const fileFields = formConfigMeta!.fields.filter(
      (field) => field.type === "image" || field.type == "images",
    );
    const uploadRequest: { files: { key: string; type: string }[]; path: string }[] = [];
    const uploadFiles: { key: string; file: File; type: string }[] = [];
    fileFields.map((field, uploadIndex) => {
      const files: File | File[] = ObjectUtil.getValue({
        obj: data,
        path: field.path,
      });
      if (files) {
        uploadRequest.push({ files: [], path: field.path });
        if (Array.isArray(files)) {
          const value: string[] = [];
          files.map((file: File, index: number) => {
            value.push(uuidv4());
            uploadRequest[uploadIndex].files.push({ key: value[index], type: file.type });
            uploadFiles.push({ key: value[index], file, type: file.type });
            ObjectUtil.setValue({
              obj: requestData,
              path: field.path,
              value: value,
            });
          });
        } else {
          const value: string = uuidv4();
          uploadRequest[uploadIndex].files.push({ key: value, type: files.type });
          uploadFiles.push({ key: value, file: files, type: files.type });
          ObjectUtil.setValue({
            obj: requestData,
            path: field.path,
            value: value,
          });
        }
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
      if (uploadRequest && uploadRequest.length) {
        const resUpload = await fetch("/api/upload", {
          method: "POST",
          body: JSON.stringify({
            modelName: model,
            id: response.data._id,
            uploadRequest: uploadRequest,
          }),
        });
        if (resUpload && resUpload.ok) {
          const responseJSon = await resUpload.json();
          const { uploadUrls }: { uploadUrls: { key: string; url: string }[] } = responseJSon;
          const uploadRequests = uploadFiles.map((uploadFile) => ({
            file: uploadFile.file,
            url: uploadUrls.find((uploadUrl) => uploadUrl.key === uploadFile.key)?.url,
            key: uploadFile.key,
          }));
          await Promise.all(
            uploadRequests.map(({ key, file, url }) => uploadFile(key, file, url!)),
          );
        }
      }
      setStatus("success");
    } else {
      SetError(response.message ?? "Something not correct, please try again later.");
      setStatus("error");
    }
    setTimeout(() => setStatus("idle"), 10000);
  };

  async function uploadFile(key: string, file: File, url: string) {
    try {
      await fetch(url, {
        method: "PUT",
        body: file,
      });
    } catch (err) {
      SetError(`Error while uploading image ${key}`);
    }
  }

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className="min-w-full items-center justify-center flex flex-col text-left m-10 pb-10 relative"
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
        <div className="w-full justify-center mt-10 grid grid-cols-4 items-start ">
          <Button
            type="submit"
            className={`${status === "submitting" ? "disabled:cursor-progress" : ""}`}
          >
            Submit {status === "submitting" ? "..." : ""}
          </Button>
          {status !== "submitting" && status !== "idle" && (
            <div
              className={`ml-10 rounded-md text-wrap col-span-3 text-sm border border-r-2 border-black p-2 fade-out-10 fade-in-10 text-white ${status == "success" ? "bg-green-600" : "bg-red-500"}`}
            >
              {status == "success" ? "Sucessfully Added" + status : (error ?? "Failed to Add")}
            </div>
          )}
        </div>
      </div>
    </form>
  );
}
