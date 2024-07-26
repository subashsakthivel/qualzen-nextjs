"use client";
import Image from "next/image";
import Link from "next/link";
import { PlusCircle, RefreshCcwIcon, Trash2Icon, Upload } from "lucide-react";

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
import { IProperty } from "@/utils/VTypes";
import { useEffect, useState } from "react";
import { ICategory } from "@/model/Category";
import { ProdcutStatus } from "@/utils/Enums";

export default function Dashboard() {
  const [properties, setProperties] = useState<IProperty[]>([]);
  const [imageFiles, setImageFiles] = useState<File[] | undefined>(undefined);
  const [categories, setCategories] = useState<ICategory[]>([]);

  useEffect(() => {
    const fetchCategory = async () => {
      await fetch("/api/categories")
        .then(async (res) => {
          if (res.status === 200) {
            const categories = await res.json();
            setCategories(categories);
          } else {
            console.log("category fetch failed");
          }
        })
        .catch((err) => console.log(err));
    };
    fetchCategory();
  }, []);

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
    setImageFiles((f) =>
      f === undefined ? [...fileList] : [...f, ...fileList]
    );
  }

  async function saveProduct(formData: FormData) {
    formData.append("properties", JSON.stringify(properties));
    if (imageFiles) {
      imageFiles.map((imgFile) => formData.append("imageSrc", imgFile));
    }

    await fetch("/api/products", {
      method: "POST",
      body: formData,
    }).then((res) => console.log("product saved ", res.json()));
  }

  return (
    <main className="grid flex-1 items-start gap-4 p-4 sm:px-6 sm:py-0 md:gap-8">
      <form
        className="mx-auto grid max-w-[59rem] flex-1 auto-rows-max gap-4"
        autoComplete="off"
        action={saveProduct}
      >
        <div className="flex items-center gap-4">
          <h1 className="flex-1 shrink-0 whitespace-nowrap text-xl font-semibold tracking-tight sm:grow-0">
            Product Form
          </h1>
          <div className="hidden items-center gap-2 md:ml-auto md:flex">
            <Button variant="outline" size="sm">
              Discard
            </Button>
            <Button size="sm">Save Product</Button>
          </div>
        </div>
        <div className="grid gap-4 md:grid-cols-[1fr_250px] lg:grid-cols-3 lg:gap-8">
          <div className="grid auto-rows-max items-start gap-4 lg:col-span-2 lg:gap-8">
            <Card x-chunk="dashboard-07-chunk-2">
              <CardHeader>
                <CardTitle>Product Category</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid gap-6 sm:grid-cols-3">
                  <div className="grid gap-3 capitalize">
                    <Label htmlFor="category">Category</Label>
                    <Select name="category">
                      <SelectTrigger id="category" aria-label="Select category">
                        <SelectValue placeholder="Select category" />
                      </SelectTrigger>
                      <SelectContent>
                        {categories.map(
                          (category, index) =>
                            category._id &&
                            !category.parentCategory && (
                              <SelectItem value={category._id} key={index}>
                                {category.name}
                              </SelectItem>
                            )
                        )}
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="grid gap-3">
                    <Label htmlFor="subcategory">Subcategory (optional)</Label>
                    <Select name="subcategory">
                      <SelectTrigger
                        id="subcategory"
                        aria-label="Select subcategory"
                      >
                        <SelectValue placeholder="Select subcategory" />
                      </SelectTrigger>
                      <SelectContent>
                        {categories.map(
                          (category, index) =>
                            category._id && (
                              <SelectItem value={category._id} key={index}>
                                {category.name}
                              </SelectItem>
                            )
                        )}
                      </SelectContent>
                    </Select>
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
                </div>
              </CardContent>
            </Card>
            <Card x-chunk="dashboard-07-chunk-1">
              <CardHeader>
                <CardTitle>Price</CardTitle>
                <CardDescription>
                  Margin Price(cost of manufacture) strictly not share to client
                  anyways
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableBody>
                    <TableRow>
                      <TableCell className="font-semibold">
                        Margin Price
                      </TableCell>
                      <TableCell>
                        <Input
                          id="stock-1"
                          name="marginPrice"
                          type="number"
                          placeholder="Optional"
                          autoComplete="off"
                          resource="off"
                        />
                      </TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell className="font-semibold">
                        Market Price
                      </TableCell>
                      <TableCell>
                        <Input id="stock-2" name="marketPrice" type="number" />
                      </TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell className="font-semibold">
                        Selling Price
                      </TableCell>
                      <TableCell>
                        <Input id="stock-3" name="sellingPrice" type="number" />
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
                  Enter the properties of the category that should be available
                  for all the product under this category
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
                    {properties.map((property, index) => (
                      <TableRow key={index} className="">
                        <TableCell className="m-0 p-1 align-top">
                          <Label className="sr-only">remove Property</Label>
                          <Trash2Icon
                            className="h-3.5 w-3.5 m-0 my-6"
                            onClick={() =>
                              setProperties(
                                properties.filter((p, i) => i !== index)
                              )
                            }
                          />
                        </TableCell>
                        <TableCell className="align-top">
                          <Label className="sr-only">Name</Label>
                          <Input
                            id="stock-1"
                            value={property.name}
                            onChange={(val) =>
                              setProperties(
                                properties.map((p, i) => {
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
                            defaulttags={
                              typeof property.value === "string"
                                ? []
                                : property.value
                            }
                            onTagValueChange={(tags: string[]) =>
                              setProperties(
                                properties.map((p, i) => {
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
                  onClick={() =>
                    setProperties((p) => [...p, { name: "", value: "" }])
                  }
                >
                  <PlusCircle className="h-3.5 w-3.5" />
                  Add Variant
                </Button>
              </CardFooter>
            </Card>
          </div>
          <div className="grid auto-rows-max items-start gap-4 lg:gap-8">
            <Card x-chunk="dashboard-07-chunk-3">
              <CardHeader>
                <CardTitle>Product Status</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid gap-6">
                  <div className="grid gap-3">
                    <Label htmlFor="status">Status</Label>
                    <Select name="status">
                      <SelectTrigger id="status" aria-label="Select status">
                        <SelectValue placeholder="Select status" />
                      </SelectTrigger>
                      <SelectContent>
                        {Object.values(ProdcutStatus).map((val, index) => (
                          <SelectItem value={val} key={index}>
                            {val}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </CardContent>
            </Card>
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
                      imageFiles ? "grid-cols-2" : ""
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
                          imageFiles
                            ? "relative shadow-lg min-w-20"
                            : "shadow-sm min-h-80"
                        }`}
                      >
                        <Upload className="h-4 w-4 text-muted-foreground" />
                        <input
                          type="file"
                          name="ImageSrc"
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
                <CardTitle>Archive Product</CardTitle>
                <CardDescription>
                  Lipsum dolor sit amet, consectetur adipiscing elit.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div></div>
                <Button size="sm" variant="secondary">
                  Archive Product
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
        <div className="flex items-center justify-center gap-2 md:hidden">
          <Button variant="outline" size="sm">
            Discard
          </Button>
          <Button size="sm">Save Product</Button>
        </div>
      </form>
    </main>
  );
}
