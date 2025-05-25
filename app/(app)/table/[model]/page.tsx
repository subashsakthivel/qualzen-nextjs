import QueryClientHook from "@/components/queryClientHook";
import TableLayout from "@/components/TableLayout";
import React from "react";

export default async function DataTable({
  params,
}: {
  params: Promise<{ model: string }>;
}): Promise<JSX.Element> {
  const { model } = await params;

  return <TableLayout model={model} />;
}
