"use client";

import DynamicTable from "./dynamic-table";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { tDataModels } from "@/util/util-type";

export default function TableLayout({
  model,
  formElement,
}: {
  model: tDataModels;
  formElement?: JSX.Element;
}) {

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
              <TabsTrigger value="data">ADD {model.toString().toUpperCase()}</TabsTrigger>
            </TabsList>

            <TabsContent value="table" className="space-y-4">
              <DynamicTable
                columns={undefined}
                pageSize={5}
                filterable={true}
                groupable={true}
                model={model}
              />
            </TabsContent>

            <TabsContent value="data" className="space-y-4">
              {formElement}
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  );
}
