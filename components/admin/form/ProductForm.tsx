"use client";
import Image from "next/image";
import { PlusCircle, RefreshCcwIcon, Router, Skull, Trash2Icon, Upload } from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Textarea } from "@/components/ui/textarea";
import TagInput from "@/components/ui/taginput";
import { useEffect, useState } from "react";
import CategoryList from "@/components/admin/SelectValueFromList";
import QueryClientHook from "@/components/queryClientHook";
import axios from "axios";
import { redirect } from "next/navigation";
import { useMutation, useQuery } from "@tanstack/react-query";
import { getDataFromServer, postDataToServer } from "@/util/dataAPI";
import { TCategory } from "@/schema/Category";
import { DataSourceMap } from "@/model/DataSourceMap";
import { TProduct } from "@/schema/Product";

type TProductFormData = Omit<TProduct, "imageNames" | "createdAt" | "updatedAt">;

export default function ProductForm({
  categorySelectComponent,
}: {
  categorySelectComponent: Readonly<React.ReactNode>;
}) {
  const [attributes, setAttributes] = useState<TProduct["attributes"]>([]);
  const [imageFiles, setImageFiles] = useState<File[] | undefined>(undefined);
  const [tags, setTags] = useState<string[]>([]);

  const mutation = useMutation({
    mutationFn: (data) => postDataToServer(DataSourceMap.product, data),
    onSuccess: () => redirect("/"),
  });

  function onImageFileChange(ev: React.FormEvent<EventTarget>) {
    if (imageFiles?.length === 9) {
      return;
    }
    const { files } = ev.target as HTMLInputElement & {
      files: FileList;
    };
    var fileList: File[] = [];
    for (let i = 0; i < files.length && i < 9; i++) {
      fileList.push(files[i]);
    }
    console.log("list ", fileList);
    setImageFiles((f) => (f === undefined ? [...fileList] : [...f, ...fileList]));
  }

  async function saveProduct(formData: FormData) {
    try {
      if (!imageFiles || imageFiles.length === 0) {
        throw new Error("Please upload at least one image.");
      }
      if (imageFiles && imageFiles.length > 9) {
        throw new Error("You can only upload a maximum of 9 images.");
      }

      const productData: TProductFormData = {
        name: formData.get("name") as string,
        description: formData.get("description") as string,
        sku: formData.get("sku") as string,
        price: parseFloat(formData.get("price") as string),
        discountedPrice: parseFloat(formData.get("discountedPrice") as string),
        stockQuantity: parseInt(formData.get("stock") as string),
        category: formData.get("category") as string,
        brand: formData.get("brand") as string,
        variants: [],
        tags: tags,
        isActive: formData.get("status") === "active",
        attributes,
      };
      const requestFormData = new FormData();
      requestFormData.append("data", JSON.stringify(productData));

      imageFiles.forEach((file) => {
        requestFormData.append(`image`, file);
      });

      const response = await axios.post("/api/dataAPI/product", requestFormData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });
      console.log("Response: ", response.data);
    } catch (err) {
      console.log(err);
    }
  }

  const handleKeyDown = (event: React.KeyboardEvent<HTMLFormElement>) => {
    if (event.key === "Enter" && event.target instanceof HTMLElement) {
      const targetTag = event.target.tagName.toLowerCase();
      if (targetTag !== "textarea") {
        event.preventDefault();
      }
    }
  };

  return (
    <QueryClientHook>
      <main className="grid flex-1 items-start gap-4 p-4 sm:px-6 sm:py-0 md:gap-8">
        <form
          className="mx-auto grid max-w-[59rem] flex-1 auto-rows-max gap-4"
          autoComplete="off"
          action={saveProduct}
          onKeyDown={handleKeyDown}
        >
          <div className="flex items-center gap-4">
            <h1 className="flex-1 shrink-0 whitespace-nowrap text-xl font-semibold tracking-tight sm:grow-0">
              Product Form
            </h1>
            <div className="hidden items-center gap-2 md:ml-auto md:flex">
              <Button size="sm" type="submit">
                Save Product
              </Button>
            </div>
          </div>
          <div className="grid gap-4 md:grid-cols-[1fr_250px] lg:grid-cols-3 lg:gap-8">
            <div className="grid auto-rows-max items-start gap-4 lg:col-span-2 lg:gap-8">
              <Card x-chunk="dashboard-07-chunk-2">
                <CardHeader>
                  <CardTitle>Product Category</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid gap-6 grid-cols-3">
                    <div className="grid gap-1 capitalize col-span-1">
                      <Label htmlFor="category">Category</Label>
                      {categorySelectComponent}
                    </div>
                    <div className="grid capitalize col-span-2">
                      <Label className="">Search Tags</Label>
                      <TagInput
                        defaulttags={tags}
                        onTagValueChange={(keyTags: string[]) => setTags(keyTags)}
                      />
                    </div>
                  </div>
                </CardContent>
              </Card>
              <Card x-chunk="dashboard-07-chunk-0">
                <CardHeader>
                  <CardTitle>Product Details</CardTitle>
                  <CardDescription>
                    Enter the product name certainly to customer identify easily
                  </CardDescription>
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
                      <Label htmlFor="stockQuantity">Stock</Label>
                      <Input
                        id="stockQuantity"
                        name="stockuantity"
                        type="number"
                        className="w-full"
                      />
                    </div>
                    <div className="grid gap-3">
                      <Label htmlFor="brand">Brand</Label>
                      <Input id="brand" name="brand" type="text" className="w-full" />
                    </div>
                  </div>
                </CardContent>
              </Card>
              <Card x-chunk="dashboard-07-chunk-1">
                <CardHeader>
                  <CardTitle>Price</CardTitle>
                </CardHeader>
                <CardContent>
                  <Table>
                    <TableBody>
                      <TableRow>
                        <TableCell className="font-semibold">Price</TableCell>
                        <TableCell>
                          <Input
                            id="stock-1"
                            name="price"
                            type="number"
                            autoComplete="off"
                            resource="off"
                          />
                        </TableCell>
                      </TableRow>
                      <TableRow>
                        <TableCell className="font-semibold">Discount Price</TableCell>
                        <TableCell>
                          <Input id="stock-2" name="discountedPrice" type="number" />
                        </TableCell>
                      </TableRow>
                    </TableBody>
                  </Table>
                </CardContent>
              </Card>
              <Card x-chunk="dashboard-07-chunk-1">
                <CardHeader>
                  <CardTitle>Properties</CardTitle>
                  <CardDescription>
                    Enter the properties of the category that should be available for all the
                    product under this category
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead></TableHead>
                        <TableHead>Name</TableHead>
                        <TableHead>Options</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {attributes.map((property, index) => (
                        <TableRow key={index} className="">
                          <TableCell className="m-0 p-1 align-top">
                            <Label className="sr-only">remove Property</Label>
                            <Trash2Icon
                              className="h-3.5 w-3.5 m-0 my-6"
                              onClick={() =>
                                setAttributes(attributes.filter((p, i) => i !== index))
                              }
                            />
                          </TableCell>
                          <TableCell className="align-top">
                            <Label className="sr-only">Name</Label>
                            <Input
                              id="stock-1"
                              value={property.name}
                              onChange={(val) =>
                                setAttributes(
                                  attributes.map((p, i) => {
                                    if (i === index) {
                                      p.name = val.target.value;
                                    }
                                    return p;
                                  })
                                )
                              }
                            />
                          </TableCell>
                          <TableCell>
                            <Label className="sr-only">Options</Label>
                            <TagInput
                              defaulttags={typeof property.value === "string" ? [] : property.value}
                              onTagValueChange={(tags: string[]) =>
                                setAttributes(
                                  attributes.map((p, i) => {
                                    if (i === index) {
                                      p.value = tags;
                                    }
                                    return p;
                                  })
                                )
                              }
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
                    onClick={() => setAttributes((p) => [...p, { name: "", value: [] }])}
                  >
                    <PlusCircle className="h-3.5 w-3.5" />
                    Add Attribute
                  </Button>
                </CardFooter>
              </Card>
            </div>
            <div className="grid auto-rows-max items-start gap-4 lg:gap-8">
              <Card className="overflow-hidden" x-chunk="dashboard-07-chunk-4">
                <CardHeader className="felx flex-row items-center justify-around">
                  <CardTitle>Product Images</CardTitle>
                  <RefreshCcwIcon
                    className="size-5 cursor-pointer"
                    onClick={() => setImageFiles([])}
                  />
                </CardHeader>
                <CardContent>
                  <div className="grid gap-2">
                    {imageFiles && imageFiles.length >= 1 && (
                      <div className="grid gap-2">
                        <Image
                          alt="Product image"
                          className="aspect-square w-full rounded-md object-cover"
                          height="300"
                          width="300"
                          src={URL.createObjectURL(imageFiles[0])}
                        />
                      </div>
                    )}

                    <div className={`grid grid-flow-* gap-2 ${imageFiles ? "grid-cols-2" : ""}`}>
                      {imageFiles &&
                        imageFiles.slice(1).map((imageFile, index) => (
                          <div key={index} className="relative">
                            <span className="absolute rounded-full border bg-background m-1 size-5 text-center">
                              {index + 2}
                            </span>
                            <Image
                              alt="Product image"
                              className="aspect-square rounded-md object-cover"
                              height="84"
                              width="84"
                              src={URL.createObjectURL(imageFile)}
                              key={index}
                            />
                          </div>
                        ))}

                      <div className="flex justify-center relative ">
                        <label
                          className={`w-full min-h-20 bg-secondary text-center border border-dashed flex flex-col items-center cursor-pointer justify-center text-sm  rounded-sm   ${
                            imageFiles ? "relative shadow-lg min-w-20" : "shadow-sm min-h-80"
                          }`}
                        >
                          <Upload className="h-4 w-4 text-muted-foreground" />
                          <input
                            type="file"
                            name="image"
                            className="hidden"
                            onChange={onImageFileChange}
                            multiple
                            accept="image/png, image/gif, image/jpeg"
                          />
                        </label>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
              <Card x-chunk="dashboard-07-chunk-5">
                <CardHeader>
                  <CardTitle>Product Status</CardTitle>
                </CardHeader>
                <CardContent>
                  <Select name="isActive" value="true">
                    <SelectTrigger aria-label="Select subcategory" className={"w-[180px]"}>
                      <SelectValue placeholder="Select subcategory" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="true">Active</SelectItem>
                      <SelectItem value="false">Inactive</SelectItem>
                    </SelectContent>
                  </Select>
                </CardContent>
              </Card>
            </div>
          </div>
          <div className="flex items-center justify-center gap-2 md:hidden">
            <Button size="sm" type="submit" disabled={mutation.isPending}>
              Save Product
            </Button>
          </div>
        </form>
      </main>
    </QueryClientHook>
  );
}
