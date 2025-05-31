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
import { useMutation, useQuery } from "@tanstack/react-query";
import { DataSourceMap } from "@/model/DataSourceMap";
import { TCategory } from "@/schema/Category";
import { useRouter } from "next/navigation";
import { PlusCircle, Trash2Icon } from "lucide-react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import TagInput from "@/components/ui/taginput";
import { TCategorySpecificAttributes } from "@/schema/CategorySpecificAttributes";
import { Textarea } from "@/components/ui/textarea";
import { FetchDataParams, getDataFromServer, postDataToServer } from "@/util/dataAPI";
const model = "category";
const CategoryForm = ({
  categorySelectComponent,
}: {
  categorySelectComponent: Readonly<React.ReactNode>;
}) => {
  const router = useRouter();
  const [attributes, setAttributes] = React.useState<TCategorySpecificAttributes[]>([]);
  const mutation = useMutation({
    mutationFn: (data: { data: TCategory }) => postDataToServer(DataSourceMap.category, data),
    onSuccess: () => {
      router.push("/table/category");
    },
  });

  async function init() {
    const options: FetchDataParams = {
      select: "name attributes",
      populate: [{ path: "attributes" }],
    };
    const tableData = await getDataFromServer(DataSourceMap[model], "GET_DATA", options);
    console.log("Fetched tableData:", tableData);
    return tableData.docs as Record<string, any>[];
  }

  const handleCreatePost = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const formData = new FormData(event.currentTarget);
    const parentCategory = formData.get("parentCategory") as string;
    const data: TCategory = {
      name: formData.get("name") as string,
      description: formData.get("description") as string,
      slug: formData.get("name")?.toString().toLowerCase().replace(/\s+/g, "-") || "",
      parentCategory: !parentCategory || parentCategory === "none" ? null : parentCategory,
      attributes,
    };
    mutation.mutate({ data });
  };
  const handleKeyDown = (event: React.KeyboardEvent<HTMLFormElement>) => {
    if (event.key === "Enter" && event.target instanceof HTMLElement) {
      const targetTag = event.target.tagName.toLowerCase();
      if (targetTag !== "textarea") {
        event.preventDefault();
      }
    }
  };
  return (
    <div className="m-10">
      <form
        className=" grid max-w-[59rem] flex-1 auto-rows-max gap-4"
        autoComplete="off"
        onSubmit={handleCreatePost}
        onKeyDown={handleKeyDown}
      >
        <div className="flex items-center gap-4">
          <h1 className="flex-1 shrink-0 whitespace-nowrap text-xl font-semibold tracking-tight sm:grow-0">
            Category Form
          </h1>
          <div className="hidden items-center gap-2 md:ml-auto md:flex">
            <Button size="sm" type="submit">
              Save Category
            </Button>
          </div>
        </div>
        <div className="grid gap-4  lg:gap-8">
          <div className="grid auto-rows-max items-start gap-4 lg:col-span-2 lg:gap-8">
            <Card x-chunk="dashboard-07-chunk-0">
              <CardHeader>
                <CardTitle>Category Details</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid gap-6">
                  <div className="grid gap-3">
                    <Label htmlFor="name">Name</Label>
                    <Input
                      id="name"
                      name="name"
                      type="text"
                      className="w-full"
                      placeholder="White Mens Baggy Shirt"
                    />
                  </div>
                  <div className="grid gap-3">
                    <Label htmlFor="description">Description</Label>
                    <Textarea
                      name="description"
                      id="description"
                      placeholder="Description should mention product details which is user can't seen by picture of product"
                      className="min-h-32"
                    />
                  </div>
                  <div className="grid gap-3">
                    <Label htmlFor="parentCategory">Parent Category</Label>
                    {categorySelectComponent}
                  </div>
                </div>
              </CardContent>
            </Card>
            <Card x-chunk="dashboard-07-chunk-1">
              <CardHeader>
                <CardTitle>Attributes</CardTitle>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead></TableHead>
                      <TableHead>Name</TableHead>
                      <TableHead>Allowed Values</TableHead>
                      <TableHead>Mandatory For Product</TableHead>
                      <TableHead>Mandatory For Varient</TableHead>
                      <TableHead>Order</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {attributes.map((attribute, index) => (
                      <TableRow key={index} className="justify-start">
                        <TableCell className="m-0 p-1 align-top">
                          <Label className="sr-only">remove Property</Label>
                          <Trash2Icon
                            className="h-3.5 w-3.5 m-0 my-6"
                            onClick={() => setAttributes(attributes.filter((p, i) => i !== index))}
                          />
                        </TableCell>
                        <TableCell className="align-top">
                          <Label className="sr-only">Name</Label>
                          <Input
                            id="stock-1"
                            value={attribute.attributeName}
                            onChange={(e) => {
                              attribute.attributeName = e.target.value;
                              setAttributes([...attributes]);
                            }}
                          />
                        </TableCell>
                        <TableCell className="align-top">
                          <Label className="sr-only">Allowed values</Label>
                          <TagInput
                            defaulttags={[]}
                            onTagValueChange={(tags: string[]) => {
                              attribute.allowedValues = tags;
                              setAttributes([...attributes]);
                            }}
                          />
                        </TableCell>
                        <TableCell className="align-top">
                          <Label className="sr-only">Mandatory For Product</Label>
                          <Select
                            value={attribute.isMandatoryForProduct ? "true" : "false"}
                            onValueChange={(value) => {
                              attribute.isMandatoryForProduct = value === "true";
                              setAttributes([...attributes]);
                            }}
                          >
                            <SelectTrigger aria-label="Select subcategory" className={"w-[180px]"}>
                              <SelectValue placeholder="Select subcategory" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem key={index + "t"} value={"true"}>
                                Yes
                              </SelectItem>
                              <SelectItem key={index + "f"} value={"false"}>
                                No
                              </SelectItem>
                            </SelectContent>
                          </Select>
                        </TableCell>
                        <TableCell className="align-top">
                          <Label className="sr-only">Mandatory For Varient</Label>
                          <Select
                            value={attribute.isMandatoryForVariant ? "true" : "false"}
                            onValueChange={(value) => {
                              attribute.isMandatoryForVariant = value === "true";
                              setAttributes([...attributes]);
                            }}
                          >
                            <SelectTrigger aria-label="Select subcategory" className={"w-[180px]"}>
                              <SelectValue placeholder="Select subcategory" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem key={index + "t"} value={"true"}>
                                Yes
                              </SelectItem>
                              <SelectItem key={index + "f"} value={"false"}>
                                NO
                              </SelectItem>
                            </SelectContent>
                          </Select>
                        </TableCell>
                        <TableCell className="align-top">
                          <Label className="sr-only">Order</Label>
                          <Input
                            id="stock-1"
                            type="number"
                            value={attribute.sortOrder}
                            min={0}
                            onChange={(e) => {
                              (attribute.sortOrder = Math.round(Number(e.target.value))),
                                setAttributes([...attributes]);
                            }}
                          />
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
              <CardFooter className="justify-center border-t p-4">
                <Button
                  type="button"
                  size="sm"
                  variant="ghost"
                  className="gap-1"
                  onClick={() =>
                    setAttributes([
                      ...attributes,
                      {
                        attributeName: "",
                        allowedValues: [],
                        attributeType: "text",
                        isMandatoryForProduct: true,
                        isMandatoryForVariant: true,
                        sortOrder: 0,
                      },
                    ])
                  }
                >
                  <PlusCircle className="h-3.5 w-3.5" />
                  Add Attribute
                </Button>
              </CardFooter>
            </Card>
          </div>
        </div>
        <div className="flex items-center justify-center gap-2 md:hidden">
          <Button size="sm" type="submit" disabled={mutation.isPending}>
            Save Product
          </Button>
        </div>
      </form>
    </div>
  );
};

export default CategoryForm;
