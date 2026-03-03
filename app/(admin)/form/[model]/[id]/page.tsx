import React from "react";
import { DynamicForm } from "@/components/admin/form/DynamicForm";

export default async function Form({
    params,
}: {
    params: Promise<{ model: "category" | "content" | "offer", id: string }>;
}): Promise<JSX.Element> {
    const { model, id } = await params;


    return (
        <div>
            <DynamicForm model={model} id={id} />
        </div>
    );
}
