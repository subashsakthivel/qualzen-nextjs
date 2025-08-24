"use client";

import { useState } from "react";
import DynamicTable, { ColumnConfig } from "./dynamic-table";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { useQuery } from "@tanstack/react-query";
import { DataSourceMap } from "@/model/DataSourceMap";
import { tDataModels } from "@/util/util-type";

export default function TableLayout({ model }: { model: tDataModels }) {
  return (
    <div className="container mx-auto py-8 space-y-8">
      <Card>
        <CardHeader>
          <CardTitle>{model.toUpperCase()}</CardTitle>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="table">
            <TabsList className="mb-4">
              <TabsTrigger value="table">TABLE</TabsTrigger>
              <TabsTrigger value="data">ADD {model.toUpperCase()}</TabsTrigger>
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
              {/** Add Data*/}
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  );
}
