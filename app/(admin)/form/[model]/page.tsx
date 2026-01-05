import React from "react";
import { fetchFormMetaData, tFormConfigMeta } from "../../table/[model]/modelform";
import { DynamicForm } from "@/components/admin/form/DynamicForm";
import DataClientAPI from "@/util/client/data-client-api";

export default async function Form({
  params,
}: {
  params: Promise<{ model: "category" | "content" | "offer" }>;
}): Promise<JSX.Element> {
  const { model } = await params;

  return (
    <div>
      <DynamicForm model={model} />
    </div>
  );
}
