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
import { TCategory } from "@/schema/Category";
import { useRouter } from "next/navigation";
const CategoryForm = ({
  categorySelectComponent,
}: {
  categorySelectComponent: Readonly<React.ReactNode>;
}) => {
  const router = useRouter();
  const mutation = useMutation({
    mutationFn: (data: TCategory) => postDataToServer(DataSourceMap.category, data),
    onSuccess: () => {
      console.log("Category created successfully");

      router.push("/table/category");
    },
  });

  const handleCreatePost = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const formData = new FormData(event.currentTarget);
    const parentCategory = formData.get("parentCategory") as string;
    const data: TCategory = {
      name: formData.get("name") as string,
      slug: formData.get("name")?.toString().toLowerCase().replace(/\s+/g, "-") || "",
      parentCategory: !parentCategory || parentCategory === "none" ? null : parentCategory,
    };
    mutation.mutate(data);
  };
  return (
    <Card className={cn("w-full max-w-md justify-center")}>
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
            {categorySelectComponent}
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
};

export default CategoryForm;
