import TableLayout from "@/components/TableLayout";
import { tDataModels } from "@/util/util-type";
import React from "react";

export default async function DataTable({
  params,
}: {
  params: Promise<{ model: string }>;
}): Promise<JSX.Element> {
  const { model } = await params;

  return <TableLayout model={model as tDataModels} />;
}
