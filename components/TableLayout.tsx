"use client";

import DynamicTable from "./dynamic-table";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { tDataModels } from "@/util/util-type";
import { useState } from "react";
import CategoryForm from "./admin/form/CategoryForm";
import ProductForm from "./admin/form/ProductForm";

const FormVsModel: Record<tDataModels, ({ id }: { id?: string }) => JSX.Element> = {
  category: CategoryForm,
  product: ProductForm,
};

export default function TableLayout({ model }: { model: tDataModels }) {
  const [id, setId] = useState<string | undefined>(undefined);
  const FormComponent = FormVsModel[model];
  return (
    <div className="container mx-auto py-8 space-y-8">
      <Card>
        <CardHeader>
          <CardTitle>{model.toString().toUpperCase()}</CardTitle>
        </CardHeader>
        <CardContent>
          <Tabs>
            <TabsList className="mb-4">
              <TabsTrigger value="table">VIEW</TabsTrigger>
              <TabsTrigger value="data">
                {id ? "UPDATE" : "ADD"} {model.toString().toUpperCase()}
              </TabsTrigger>
            </TabsList>

            <TabsContent value="table" className="space-y-4">
              <DynamicTable
                columns={undefined}
                pageSize={5}
                filterable={true}
                groupable={true}
                model={model}
                onEdit={(recordId: string) => setId(recordId)}
              />
            </TabsContent>

            <TabsContent value="data" className="space-y-4">
              <FormComponent id={id} />
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  );
}
