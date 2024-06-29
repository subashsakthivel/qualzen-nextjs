"use client";
import Image from "next/image";
import { PlusCircle, Trash2Icon, Upload } from "lucide-react";

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
import { useState } from "react";
import { PropertyType } from "@/utils/VTypes";
import TagInput from "@/components/ui/taginput";

export default function Dashboard() {
  const [properties, setProperties] = useState<PropertyType[]>([]);
  const [imageFile, setImageFile] = useState<File | undefined>(undefined);

  function onImageFileChange(ev: React.FormEvent<EventTarget>) {
    const { files } = ev.target as HTMLInputElement & {
      files: FileList;
    };
    console.log(typeof files[0]);
    setImageFile(files[0]);
  }

  function saveCategory(formData: FormData) {
    console.log(
      formData.get("name"),
      formData.get("description"),
      formData.get("parentCategory"),
      formData.get("categoryImage")
    );
  }

  return (
    <main className="grid flex-1 items-start gap-4 p-4 sm:px-6 sm:py-0 md:gap-8">
      <form
        className="mx-auto grid max-w-[59rem] flex-1 auto-rows-max gap-4"
        action={saveCategory}
      >
        <div className="flex items-center gap-4">
          <h1 className="flex-1 shrink-0 whitespace-nowrap text-xl font-semibold tracking-tight sm:grow-0">
            Category Form
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
            <Card x-chunk="dashboard-07-chunk-0">
              <CardHeader>
                <CardTitle>Catregory Details</CardTitle>
                <CardDescription>
                  Enter the category name certainly to customer identify easily
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
                      placeholder="Shirts"
                    />
                  </div>
                  <div className="grid gap-3">
                    <Label htmlFor="description">Description</Label>
                    <Textarea
                      id="description"
                      name="description"
                      placeholder="Description should mention category values over relaiable"
                      className="min-h-32"
                    />
                  </div>
                  <div className="grid gap-3">
                    <Label htmlFor="subcategory">
                      Parent Category (optional)
                    </Label>
                    <Select name="parentCategory">
                      <SelectTrigger
                        id="subcategory"
                        aria-label="Select subcategory"
                      >
                        <SelectValue placeholder="Select subcategory" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="t-shirts">T-Shirts</SelectItem>
                        <SelectItem value="hoodies">Hoodies</SelectItem>
                        <SelectItem value="sweatshirts">Sweatshirts</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
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
            <Card className="overflow-hidden" x-chunk="dashboard-07-chunk-4">
              <CardHeader>
                <CardTitle>Category Image</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex justify-center relative">
                  <label
                    className={`w-full min-h-80  text-center flex flex-col items-center cursor-pointer justify-center text-sm  rounded-sm   ${
                      imageFile
                        ? "relative shadow-lg"
                        : "border border-dashed shadow-sm"
                    }`}
                  >
                    {imageFile ? (
                      <Image
                        src={URL.createObjectURL(imageFile)}
                        alt="category image"
                        className="rounded-sm border shadow-sm"
                        fill
                        style={{ objectFit: "cover" }}
                      />
                    ) : (
                      <Upload className="h-4 w-4 text-muted-foreground" />
                    )}
                    <input
                      type="file"
                      className="hidden"
                      name="categoryImage"
                      onChange={onImageFileChange}
                      accept="image/png, image/gif, image/jpeg"
                    />
                  </label>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
        <div className="flex items-center justify-center gap-2 md:hidden">
          <Button variant="outline" size="sm">
            Discard
          </Button>
          <Button size="sm">Save Category</Button>
        </div>
      </form>
    </main>
  );
}
