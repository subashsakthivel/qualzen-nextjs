"use client";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { FormFieldMeta, getFormMetaData, tFormConfigMeta } from "@/app/(admin)/table/[model]/modelform";
import DataClientAPI from "@/util/client/data-client-api";
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import ObjectUtil from "@/util/ObjectUtil";
import { v4 as uuidv4 } from "uuid";
import { tDataModels, TUpdate } from "@/util/util-type";
import FormRender from "./components/form-render";


interface DynamicFormProps {
  model: tDataModels; //"category" | "content" | "offer"
  id?: string;
}

export function DynamicForm({ model, id }: DynamicFormProps) {
  const [error, setError] = useState<string | undefined>(undefined);
  const [status, setStatus] = useState<"idle" | "submitting" | "success" | "error">("idle");
  const formConfigMeta = getFormMetaData(model);
  const [oldData, setOldData] = useState<any>(undefined);
  const {
    register,
    handleSubmit,
    formState: { errors, ...others },
    control,
    reset,
    watch
  } = useForm({
    resolver: formConfigMeta?.schema ? zodResolver(formConfigMeta.schema) : undefined,
  });


  const onSubmit = async (data: any) => {
    debugger;
    console.log("WATCH:", watch(), "errors : ", errors);
    setError(undefined);
    setStatus("submitting");
    console.log("form Data ", JSON.parse(JSON.stringify(data)))
    const requestData = {} as any;
    formConfigMeta!.fields.map((field) => {
      const value = ObjectUtil.getValue({ obj: data, path: field.path });
      if (field.type === "tags") {
        ObjectUtil.setValue({ obj: requestData, path: field.path, value: Array.isArray(value) ? value : value.split(",").map((tag: string) => tag.trim()) });
      } else if (field.type === "bool") {
        ObjectUtil.setValue({ obj: requestData, path: field.path, value: value === "true" || value === true });
      } else {
        ObjectUtil.setValue({ obj: requestData, path: field.path, value });
      }
    });
    console.log("request Data ", requestData)
    const fileFields = formConfigMeta!.fields.filter(
      (field) => field.type === "image" || field.type == "images",
    );
    const uploadRequest: { files: { key: string; type: string }[]; path: string }[] = [];
    const uploadFiles: { key: string; file: File; type: string }[] = [];
    fileFields.map((field, uploadIndex) => {
      const files: File | File[] | string | string[] = ObjectUtil.getValue({
        obj: data,
        path: field.path,
      });
      if (files) {
        uploadRequest.push({ files: [], path: field.path });
        if (Array.isArray(files)) {
          const value: string[] = [];
          files.filter((file: File | string) => file instanceof File).map((file: File, index: number) => {
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
          if (files instanceof File) {
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
      }
    });

    console.log(requestData);
    if (id) {
      //update
      const updateQuery: TUpdate<any> = {};
      const deleteFilesRequest: { key: string }[] = [];
      formUpdateQuery(formConfigMeta.fields, requestData, oldData, updateQuery, deleteFilesRequest);
      console.log(updateQuery);
      const response = await DataClientAPI.patchData({
        modelName: model,
        request: {
          updateQuery,
          operation: "UPDATE_DATA_BY_ID",
          id,
        },
      });
      if (response.success) {
        await processUploadFileRequests(uploadRequest, uploadFiles, response);
        setStatus("success");
      } else {
        setError(response.message ?? "Something not correct, please try again later.");
        setStatus("error");
      }
    } else {
      const response = await DataClientAPI.saveData({
        modelName: model,
        request: {
          data: requestData,
          operation: "SAVE_DATA",
        },
      });
      if (response.success) {
        debugger;
        await processUploadFileRequests(uploadRequest, uploadFiles, response);
        setStatus("success");
      } else {
        setError(response.message ?? "Something not correct, please try again later.");
        setStatus("error");
      }
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
      setError(`Error while uploading image ${key}`);
    }
  }

  async function processUploadFileRequests(uploadRequest: { files: { key: string; type: string }[]; path: string }[], uploadFiles: { key: string; file: File; type: string }[], response: any) {
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
  }

  function formUpdateQuery(fields: FormFieldMeta[], data: any, oldData: any, updateQuery: TUpdate<any>, deleteFilesRequest: { key: string }[], parantObj?: string) {
    debugger;
    fields.map((field) => {
      const currValue = ObjectUtil.getValue({ obj: data, path: field.path });
      const oldValue = ObjectUtil.getValue({ obj: oldData, path: field.path });
      const fieldPath = parantObj ? parantObj + "." + field.path : field.path;
      switch (field.type) {
        case "text":
        case "textarea":
        case "bool":
        case "link":
        case "number":
        case "unique":
        case "tags":
        case "select":
          if (currValue && !ObjectUtil.isEqualObject(currValue, oldValue)) {
            if (!updateQuery.set) {
              updateQuery.set = {}
            }
            updateQuery.set[fieldPath] = currValue;
          }
          break;
        case "image":
        case "images":
          if (currValue && !ObjectUtil.isEqualObject(currValue, oldValue)) {
            if (!updateQuery.set) {
              updateQuery.set! = {}
            }
            updateQuery.set[field.path] = currValue;
            if (Array.isArray(oldValue)) {
              deleteFilesRequest.push(...oldValue.map((k: string) => ({ key: k })));
            } else if (oldValue) {
              deleteFilesRequest.push({ key: oldValue });
            }
          }
          break;
        case "subFormArray":
          if (currValue && (Array.isArray(oldValue) && oldValue.length > 0) && Array.isArray(currValue) && field.subFormConfig?.fields) {
            currValue.map((item, index) => {
              formUpdateQuery(field.subFormConfig?.fields!, item, oldValue[index], updateQuery, deleteFilesRequest, field.name + "." + index);
            })
          } else if (currValue && Array.isArray(currValue)) {
            if (!updateQuery.set) {
              updateQuery.set = {}
            }
            updateQuery.set[field.path] = currValue;
          }
          break;
        default:
          break;
      }
    });
  }

  useEffect(() => {
    if (id) {
      const fetchData = async () => {
        const response = await DataClientAPI.getData({
          modelName: model,
          operation: "GET_DATA_BY_ID",
          request: {
            id
          },
        });
        reset(response);
        setOldData(response);
      }
      fetchData();
    }
  }, [])

  return (
    <form
      id="dynamic-form"
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
            form="dynamic-form"
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
