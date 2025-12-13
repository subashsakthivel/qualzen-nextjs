"use client";
import Image from "next/image";
import { PlusCircle, RefreshCcwIcon, Trash2Icon, Upload, X } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";

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
import QueryClientHook from "@/components/queryClientHook";
import axios from "axios";
import { redirect } from "next/navigation";
import { useMutation, useQuery } from "@tanstack/react-query";
import { TCategory } from "@/schema/Category";
import { TProduct } from "@/schema/Product";
import { TProductVariant } from "@/schema/ProductVarient";
import { v4 as uuidv4 } from "uuid";
import DataClientAPI from "@/util/client/data-client-api";
import Link from "next/link";

type TProductFormData = Omit<TProduct, "createdAt" | "updatedAt">;
const MAX_ALLOWED_FILE_COUNT = 8;
export default function ProductForm({ id }: { id?: string }) {
  const [attributes, setAttributes] = useState<TProduct["attributes"]>([]);
  const [imageFiles, setImageFiles] = useState<File[]>([]);
  const [tags, setTags] = useState<string[]>([]);
  const [variants, setVariants] = useState<TProduct["variants"]>([]);

  const [curVarient, setCurentVarient] = useState<number>(-1);
  const { data: { categories, product } = { categories: [], product: undefined }, isLoading } =
    useQuery({
      queryKey: ["categories.product", id],
      refetchOnWindowFocus: false,
      queryFn: async () => {
        const categoryRes = await DataClientAPI.getData({
          modelName: "category",
          operation: "GET_DATA_RAW",
          request: {},
        });
        const categories = JSON.parse(JSON.stringify(categoryRes?.docs ?? [])) as TCategory[];
        if (id) {
          const productRes = await DataClientAPI.getData({
            modelName: "product",
            operation: "GET_DATA_BY_ID_RAW",
            request: { id },
          });
          const product = JSON.parse(JSON.stringify(productRes)) as TProduct;
          setAttributes(product.attributes);
          setTags(product.tags);
          setVariants(product.variants);
          return { categories, product };
        }
        return { categories };
      },
    });

  const mutation = useMutation({
    mutationFn: async (formData: FormData) => await saveProduct(formData),
    onSuccess: () => redirect("/"),
  });

  function onImageFileChange(ev: React.FormEvent<EventTarget>) {
    if (imageFiles?.length === MAX_ALLOWED_FILE_COUNT) {
      return; // toast limit
    }
    const { files } = ev.target as HTMLInputElement & {
      files: FileList;
    };
    if (files.length > MAX_ALLOWED_FILE_COUNT) {
      return;
    }
    var fileList: File[] = [];
    for (let i = 0; i < files.length; i++) {
      fileList.push(files[i]);
    }
    console.log("list ", fileList);
    setImageFiles([...imageFiles, ...fileList]);
  }

  async function saveProduct(formData: FormData) {
    try {
      if (!imageFiles || imageFiles.length === 0) {
        throw new Error("Please upload at least one image.");
      }
      if (imageFiles && imageFiles.length > MAX_ALLOWED_FILE_COUNT) {
        throw new Error("You can only upload a maximum of 5 images.");
      }

      // todo : zod check before request
      const productForm = new FormData();
      const imageNames: string[] = [];
      const imageMap = {} as any;

      imageFiles.forEach((imageFile) => {
        const name = uuidv4();
        imageNames.push(name);
        productForm.append(name, imageFile);
        imageMap[name] = imageFile;
      });

      const product: TProductFormData = {
        name: formData.get("name") as string,
        category: formData.get("category") as string,
        description: formData.get("description") as string,
        brand: formData.get("brand") as string,
        slug: formData.get("slug") as string,
        tags: tags,
        images: imageNames,
        attributes: [...attributes].filter((att) => att.value !== ""),
        variants,
      };

      const saveResponse = await DataClientAPI.saveData({
        modelName: "product",
        request: {
          data: product,
          operation: "SAVE_DATA",
        },
      });
      if (saveResponse.success) {
        debugger;
        const { data: savedProduct } = saveResponse;
        const response = await fetch("/api/upload", {
          method: "POST",
          body: JSON.stringify({
            modelName: "product",
            id: savedProduct._id,
          }),
        });
        if (response && response.ok) {
          debugger;
          const responseJson = await response.json();
          const { data: uploadUrls } = responseJson;
          Promise.allSettled(
            uploadUrls.map(
              async ({ key, uploadUrl }: { key: string; uploadUrl: string }) =>
                await fetch(uploadUrl, {
                  method: "PUT",
                  body: imageMap[key],
                })
            )
          );
        }
      }
    } catch (err) {
      console.log(err);
    }
  }

  function addNewVarient() {
    const newVarient: TProduct["variants"][0] = {
      attributes: [],
      isActive: true,
      sku: "",
      stockQuantity: 0,
      price: 0,
      sellingPrice: 0,
    };
    setCurentVarient(variants.length);
    setVariants([...variants, newVarient]);
  }

  async function onCategoryChange(categoryId: string) {
    const sampleProduct = await DataClientAPI.getData({
      modelName: "product",
      operation: "GET_DATA_ONE",
      request: { options: { category: categoryId } },
    });
    debugger;
    if (sampleProduct) {
      const product = sampleProduct;
      setAttributes(product.attributes);
      setVariants(product.variants);
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

  if (!categories || categories.length == 0) {
    return (
      <div className="grid grid-flow-col gap-10">
        <h1>No Category yet created</h1>
        <Link href={"/table/category"}>
          <Button>Create Now</Button>
        </Link>
      </div>
    );
  }

  return (
    <QueryClientHook>
      <main className="grid flex-1 items-start gap-4 sm:px-6 sm:py-0 md:gap-8 p-10">
        <form
          className="grid flex-1  gap-4 m-16 mx-28"
          action={mutation.mutate}
          onKeyDown={handleKeyDown}
        >
          <div className="flex items-center gap-4">
            <h1
              className="flex-1 shrink-0 whitespace-nowrap text-xl font-semibold tracking-tight sm:grow-0 cursor-pointer"
              onClick={() => setCurentVarient(-1)}
            >
              Product Form
            </h1>

            <div className="hidden items-center gap-2 md:ml-auto md:flex">
              <Button size="sm" type="submit" disabled={mutation.isPending}>
                Save Product
              </Button>
            </div>
          </div>
          <div className="grid gap-4 lg:grid-cols-3 lg:gap-8">
            <div className="grid auto-rows-max items-start gap-4 lg:col-span-2 lg:gap-8">
              <Card x-chunk="dashboard-07-chunk-2">
                <CardHeader>
                  <CardTitle>Product Category</CardTitle>
                </CardHeader>
                <CardContent className="grid grid-cols-2 gap-10">
                  <div className="grid gap-6 grid-cols-2 col-span-2">
                    <div className="grid gap-1 capitalize ">
                      <Label htmlFor="category">Category</Label>
                      <Select name="category" onValueChange={(value) => onCategoryChange(value)}>
                        <SelectTrigger aria-label="Select category" className={"w-[180px]"}>
                          <SelectValue placeholder="Select category" />
                        </SelectTrigger>
                        <SelectContent>
                          {categories.map((category: TCategory, i: number) => (
                            <SelectItem key={i} value={category._id!}>
                              {category.name}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="grid gap-1 capitalize ">
                      <Label htmlFor="status">Status</Label>
                      <Select name="status" value="true">
                        <SelectTrigger aria-label="Select Status" className={"w-[180px]"}>
                          <SelectValue placeholder="Select Status" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="true">Active</SelectItem>
                          <SelectItem value="false">Inactive</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                  <div className="grid gap-3 col-span-2">
                    <Label className="">Search Tags</Label>
                    <TagInput
                      defaulttags={tags}
                      onTagValueChange={(keyTags: string[]) => setTags(keyTags)}
                    />
                  </div>
                  <div className="grid gap-3 col-span-2">
                    <Label htmlFor="name">Product Name</Label>
                    <Input id="name" name="name" type="text" className="w-full" />
                  </div>
                  <div className="grid gap-3 col-span-2">
                    <Label htmlFor="description">Description</Label>
                    <Textarea
                      name="description"
                      id="description"
                      placeholder="Description should mention product details which is user can't seen by picture of product"
                      className="min-h-32"
                    />
                  </div>
                  <div className="grid gap-3 col-span-2">
                    <Label htmlFor="brand">Brand</Label>
                    <Input id="brand" name="brand" type="text" className="w-full" />
                  </div>
                  <div className="grid gap-3">
                    <Label htmlFor="slug">Slug</Label>
                    <Input id="slug" name="slug" type="text" className="w-full" />
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
                        <TableHead>Value</TableHead>
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
                            <Input
                              id="stock-1"
                              value={property.value}
                              onChange={(val) =>
                                setAttributes(
                                  attributes.map((p, i) => {
                                    if (i === index) {
                                      p.value = val.target.value;
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
                    onClick={() =>
                      setAttributes((p) => [...p, { name: "", value: "", sortOrder: 100 }])
                    }
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

                    <div
                      className={`grid grid-flow-* gap-2 ${
                        (imageFiles?.length ?? 0) > 0 ? "grid-cols-2" : ""
                      }`}
                    >
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
                            (imageFiles?.length ?? 0) > 0
                              ? "relative shadow-lg min-w-20"
                              : "shadow-sm min-h-80"
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
            </div>
          </div>
          <div className=" grid grid-cols-1 gap-4">
            {variants.map((varient, idx) => (
              <div className="grid gap-4 lg:grid-cols-3 lg:gap-8 border-2" key={idx}>
                <div className="grid auto-rows-max items-start gap-4 lg:col-span-2 lg:gap-8">
                  <Card x-chunk="dashboard-07-chunk-1">
                    <CardHeader>
                      <CardTitle>Varaint {idx + 1}</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <Table>
                        <TableBody>
                          <TableRow>
                            <TableCell className="font-semibold">Stock Quantity</TableCell>
                            <TableCell>
                              <Input
                                id="stock-1"
                                type="number"
                                autoComplete="off"
                                resource="off"
                                value={varient.stockQuantity}
                                onChange={(e) => {
                                  varient.stockQuantity = Number.parseInt(e.target.value);
                                  setVariants([...variants]);
                                }}
                              />
                            </TableCell>
                            <TableCell className="font-semibold">SKU</TableCell>
                            <TableCell>
                              <Input
                                id="sku"
                                name="sku"
                                type="text"
                                className="w-full"
                                value={varient.sku}
                                onChange={(e) => {
                                  (varient.sku = e.target.value), setVariants([...variants]);
                                }}
                              />
                            </TableCell>
                          </TableRow>
                          <TableRow>
                            <TableCell className="font-semibold">Price</TableCell>
                            <TableCell>
                              <Input
                                id="stock-2"
                                type="number"
                                value={varient.price}
                                onChange={(e) => {
                                  varient.price = Number.parseInt(e.target.value ?? 0);
                                  setVariants([...variants]);
                                }}
                              />
                            </TableCell>
                            <TableCell className="font-semibold">Selling Price</TableCell>
                            <TableCell>
                              <Input
                                id="stock-2"
                                type="number"
                                value={varient.sellingPrice}
                                onChange={(e) => {
                                  varient.sellingPrice = Number.parseInt(e.target.value ?? 0);
                                  setVariants([...variants]);
                                }}
                              />
                            </TableCell>
                          </TableRow>
                        </TableBody>
                      </Table>
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
                            <TableHead>Options</TableHead>
                          </TableRow>
                        </TableHeader>
                        <TableBody>
                          {varient.attributes.map((property, index) => (
                            <TableRow key={index} className="">
                              <TableCell className="m-0 p-1 align-top">
                                <Label className="sr-only">remove Property</Label>
                                <Trash2Icon
                                  className="h-3.5 w-3.5 m-0 my-6"
                                  onClick={() => {
                                    varient.attributes = varient.attributes.filter(
                                      (p, i) => i !== index
                                    );
                                    setVariants([...variants]);
                                  }}
                                />
                              </TableCell>
                              <TableCell className="align-top">
                                <Label className="sr-only">Name</Label>
                                <Input
                                  id="stock-1"
                                  value={property.name}
                                  onChange={(val) => {
                                    varient.attributes = varient.attributes.map((p, i) => {
                                      if (i === index) {
                                        p.name = val.target.value;
                                      }
                                      return p;
                                    });
                                    setVariants([...variants]);
                                  }}
                                />
                              </TableCell>
                              <TableCell>
                                <Label className="sr-only">Options</Label>
                                <Input
                                  id="stock-1"
                                  value={property.value}
                                  onChange={(val) => {
                                    varient.attributes = varient.attributes.map((p, i) => {
                                      if (i === index) {
                                        p.value = val.target.value;
                                      }
                                      return p;
                                    });
                                    setVariants([...variants]);
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
                        onClick={() => {
                          varient.attributes = [
                            ...varient.attributes,
                            { name: "", value: "", sortOrder: 100 },
                          ];
                          setVariants([...variants]);
                        }}
                      >
                        <PlusCircle className="h-3.5 w-3.5" />
                        Add Attribute
                      </Button>
                    </CardFooter>
                  </Card>
                </div>
              </div>
            ))}
          </div>
          <Button type="button" size="sm" variant="ghost" className="gap-1" onClick={addNewVarient}>
            <PlusCircle className="h-3.5 w-3.5" />
            Add Variant
          </Button>

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
