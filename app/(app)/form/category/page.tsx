"use client";

import * as React from "react";
import {
  Card,
  CardTitle,
  CardHeader,
  CardDescription,
  CardContent,
  CardFooter,
} from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

import { useMutation, useQuery } from "@tanstack/react-query";
import { getDataFromServer, postDataToServer } from "@/util/dataAPI";
import { redirect } from "next/navigation";
import { DataSourceMap } from "@/model/DataSourceMap";
import { TCategory } from "@/model/schema/DataSchema";
export default function ContactForm({ className }: React.ComponentProps<typeof Card>) {
  const { data: categoryList, status } = useQuery({
    queryKey: ["categories"],
    queryFn: () => getDataFromServer<TCategory>(DataSourceMap.category, {}),
  });

  const mutation = useMutation({
    mutationFn: (data: TCategory) => postDataToServer(DataSourceMap.category, data),
    onSuccess: () => redirect("/"),
  });

  const handleCreatePost = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const formData = new FormData(event.currentTarget);
    const parentCategory = formData.get("parentCategory") as string;
    const data: TCategory = {
      name: formData.get("name") as string,
      displayName: formData.get("name") as string,
      parentCategory: parentCategory === "none" ? undefined : parentCategory,
    };
    mutation.mutate(data);
  };

  if (status === "error") {
    return <h1>Error loading categories</h1>;
  }

  return (
    <Card className={cn("w-full max-w-md justify-center", className)}>
      <CardHeader>
        <CardTitle>Create new Category</CardTitle>
      </CardHeader>
      <form onSubmit={handleCreatePost}>
        <CardContent className="flex flex-col gap-4">
          <div className="grid gap-2">
            <Label htmlFor="name">Category Name *</Label>
            <Input id="name" name="name" type="text" required />
          </div>
          <div className="grid gap-2">
            <Label htmlFor="parentCategory">Parent Category</Label>
            <Select name="parentCategory">
              <SelectTrigger className="w-full">
                <SelectValue
                  placeholder={status === "pending" ? "Loading..." : "Select category"}
                />
              </SelectTrigger>
              <SelectContent>
                <SelectGroup>
                  <SelectItem value="none">None</SelectItem>
                  {categoryList &&
                    categoryList.docs &&
                    categoryList.docs.map((category, index) => (
                      <SelectItem key={index} value={category._id}>
                        {category.displayName}
                      </SelectItem>
                    ))}
                </SelectGroup>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
        <CardFooter>
          <Button type="submit" size="sm">
            Create Category
          </Button>
        </CardFooter>
      </form>
    </Card>
  );
}
