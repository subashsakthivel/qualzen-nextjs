import TableLayout from "@/components/TableLayout";
import { tDataModels } from "@/util/util-type";
import React from "react";
import FormVsModel from "./_components/FormVsTableMaps";

export default async function DataTable({
  params,
}: {
  params: Promise<{ model: string }>;
}): Promise<JSX.Element> {
  const { model } = await params;
  const FromElement: JSX.Element = await FormVsModel[model]();

  return <TableLayout model={model as tDataModels} formElement={FromElement} />;
}
