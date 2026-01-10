import React from "react";
import { DynamicForm } from "@/components/admin/form/DynamicForm";

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
