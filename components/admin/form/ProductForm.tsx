"use client";
import Image from "next/image";
import {
  PlusCircle,
  RefreshCcwIcon,
  RemoveFormattingIcon,
  Router,
  ShieldCloseIcon,
  Skull,
  Trash2Icon,
  Upload,
  X,
} from "lucide-react";

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
import { DataSourceMap } from "@/model/DataSourceMap";
import { TProduct } from "@/schema/Product";
import { TProductVariant } from "@/schema/ProductVarient";
import { v4 as uuidv4 } from "uuid";
import DataClientAPI from "@/util/client/data-client-api";

type TProductFormData = Omit<TProduct, "createdAt" | "updatedAt">;
type TVariant = TProductVariant & {
  predefinedAttributes: TProductVariant["attributes"];
  imageFiles: File[];
};
export default function ProductForm({ categoryList }: { categoryList: TCategory[] }) {
  const [predefinedAttributes, setPredefinedAttributes] = useState<TProduct["attributes"]>([]);
  const [attributes, setAttributes] = useState<TProduct["attributes"]>([]);
  const [categorySpecificAttributes, setCategorySpecificAttributes] = useState<
    TCategory["attributes"]
  >([]);
  const [imageFiles, setImageFiles] = useState<File[] | undefined>(undefined);
  const [tags, setTags] = useState<string[]>([]);
  const [varients, setVarients] = useState<TVariant[]>([]);
  const [curVarient, setCurentVarient] = useState<number>(-1);

  const mutation = useMutation({
    mutationFn: async (request: FormData) =>
      await DataClientAPI.saveData({ modelName: "product", request }),
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

  function onVarientImageFileChange(ev: React.FormEvent<EventTarget>, varient: TVariant) {
    if (varient.imageFiles?.length === 9) {
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
    varient.imageFiles = [...varient.imageFiles, ...fileList];
    setVarients([...varients]);
  }

  async function saveProduct(formData: FormData) {
    try {
      if (!imageFiles || imageFiles.length === 0) {
        throw new Error("Please upload at least one image.");
      }
      if (imageFiles && imageFiles.length > 9) {
        throw new Error("You can only upload a maximum of 9 images.");
      }
      const productForm = new FormData();
      if (varients.length == 0) {
        const imageNames: string[] = [];
        imageFiles.forEach((imageFile) => {
          const name = uuidv4();
          imageNames.push(name);
          productForm.append(name, imageFile);
        });
        const product: TProductFormData = {
          name: formData.get("name") as string,
          category: formData.get("category") as string,
          description: formData.get("description") as string,
          brand: formData.get("brand") as string,
          tags: tags,
          sku: formData.get("sku") as string,
          price: Number.parseFloat(formData.get("price") as string),
          sellingPrice: Number.parseFloat(formData.get("discountedPrice") as string),
          stockQuantity: Number.parseInt(formData.get("stockQuantity") as string),
          attributes: [...attributes, ...predefinedAttributes],
          variants: [],
          images: imageNames,
          isActive: formData.get("status") === "active",
        };

        productForm.append("data", JSON.stringify(product));
        debugger;
      } else {
        const imageNames: string[] = [];

        imageFiles.forEach((imageFile) => {
          const name = uuidv4();
          imageNames.push(name);
          productForm.append(name, imageFile);
        });
        varients.map((variant) => {
          variant.imageFiles.forEach((imageFile) => {
            const name = uuidv4();
            variant.images.push(name);
            productForm.append(name, imageFile);
          });
        });
        const stockQuantity =
          varients.length > 0
            ? varients.reduce((acc, variant) => acc + variant.stockQuantity, 0)
            : Number.parseInt(formData.get("stockQuantity") as string);
        const product: TProductFormData = {
          name: formData.get("name") as string,
          category: formData.get("category") as string,
          description: formData.get("description") as string,
          brand: formData.get("brand") as string,
          tags: tags,
          sku: formData.get("sku") as string,
          price: Number.parseFloat(formData.get("price") as string),
          sellingPrice: Number.parseFloat(formData.get("discountedPrice") as string),
          stockQuantity: stockQuantity,
          attributes: [...attributes],
          variants: varients.map((variant) => ({
            ...variant,
            attributes: [...variant.attributes, ...variant.predefinedAttributes],
          })),
          images: imageNames,
          isActive: formData.get("status") === "active",
        };

        productForm.append("data", JSON.stringify(product));
        debugger;
      }

      const response = await fetch("/api/dataAPI/product", {
        body: productForm,
        method: "POST",
      });
      mutation.mutate(productForm);
      console.log(await response.json());
    } catch (err) {
      console.log(err);
    }
  }

  function addNewVarient() {
    const predefinedAttributes = categorySpecificAttributes
      .filter((attr) => typeof attr !== "string")
      .map((attr) => ({
        name: attr.attributeName,
        value: attr.allowedValues[0],
        sortOrder: attr.sortOrder,
      }));
    const newVarient: TVariant = {
      attributes: [],
      images: [],
      isActive: true,
      sku: "",
      stockQuantity: 0,
      price: 0,
      sellingPrice: 0,
      predefinedAttributes,
      imageFiles: [],
    };
    setCurentVarient(varients.length);

    varients.push(newVarient);
    setVarients([...varients]);
  }

  function onCategoryChange(categoryId: string) {
    const attributes = categoryList.find((category) => category._id === categoryId)!.attributes;
    const predefinedAttr: TProduct["attributes"] = attributes
      .filter((attr) => typeof attr !== "string")
      .map((attribute) => {
        return {
          name: attribute.attributeName,
          value: typeof attribute.allowedValues[0] === "string" ? attribute.allowedValues[0] : "",
          sortOrder: attribute.sortOrder,
        };
      });
    setVarients(varients.map((varient) => ({ ...varient, predefinedAttributes: predefinedAttr })));
    setPredefinedAttributes(predefinedAttr);
    setCategorySpecificAttributes(attributes);
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
            <h1
              className="flex-1 shrink-0 whitespace-nowrap text-xl font-semibold tracking-tight sm:grow-0"
              onClick={() => setCurentVarient(-1)}
            >
              Product Form
            </h1>
            <div className="hidden items-center gap-2 md:ml-auto md:flex">
              <Button size="sm" type="button" onClick={addNewVarient}>
                Add Varient
              </Button>
            </div>
            {varients.map((varient, idx) => (
              <div className="hidden items-center gap-2 md:ml-auto md:flex relative" key={idx}>
                <Button size="sm" type="button" onClick={() => setCurentVarient(idx)}>
                  Varient
                  {" " + (idx + 1)}
                </Button>
                <X
                  className="absolute top-0 right-0 rounded-full size-4 text-white"
                  onClick={() => {
                    setCurentVarient(curVarient >= 0 ? curVarient - 1 : -1);
                    setVarients(varients.filter((varient, i) => i != idx));
                  }}
                />
              </div>
            ))}
            <div className="hidden items-center gap-2 md:ml-auto md:flex">
              <Button size="sm" type="submit">
                Save Product
              </Button>
            </div>
          </div>
          <div
            className={
              "grid gap-4 md:grid-cols-[1fr_250px] lg:grid-cols-3 lg:gap-8 " +
              (curVarient !== -1 ? "hidden" : "")
            }
          >
            <div className="grid auto-rows-max items-start gap-4 lg:col-span-2 lg:gap-8">
              <Card x-chunk="dashboard-07-chunk-2">
                <CardHeader>
                  <CardTitle>Product Category</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid gap-6 grid-cols-2">
                    <div className="grid gap-1 capitalize ">
                      <Label htmlFor="category">Category</Label>
                      <Select name="category" onValueChange={(value) => onCategoryChange(value)}>
                        <SelectTrigger aria-label="Select subcategory" className={"w-[180px]"}>
                          <SelectValue placeholder="Select subcategory" />
                        </SelectTrigger>
                        <SelectContent>
                          {categoryList.map((category: TCategory, i: number) => (
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
                  <div className="grid gap-3">
                    <Label className="">Search Tags</Label>
                    <TagInput
                      defaulttags={tags}
                      onTagValueChange={(keyTags: string[]) => setTags(keyTags)}
                    />
                  </div>
                  <div className="grid gap-3">
                    <Label htmlFor="name">Product Name</Label>
                    <Input id="name" name="name" type="text" className="w-full" />
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
                    <Label htmlFor="brand">Brand</Label>
                    <Input id="brand" name="brand" type="text" className="w-full" />
                  </div>
                  <div className="grid gap-3">
                    <Label htmlFor="price">Price</Label>
                    <Input id="price" name="price" type="number" className="w-full" />
                  </div>
                  <div className="grid gap-3">
                    <Label htmlFor="discountedPrice">Discount Price</Label>
                    <Input
                      id="discountedPrice"
                      name="discountedPrice"
                      type="number"
                      className="w-full"
                    />
                  </div>
                  <div className="grid gap-3">
                    <Label htmlFor="stockQuantity">SKU</Label>
                    <Input id="sku" name="sku" type="text" className="w-full" />
                  </div>
                  {/* <div className="grid gap-3">
                    <Label htmlFor="stockQuantity">Stock</Label>
                    <Input
                      id="stockQuantity"
                      name="stockuantity"
                      type="number"
                      className="w-full"
                    />
                  </div> */}
                </CardContent>
              </Card>

              <Card x-chunk="dashboard-07-chunk-1" className={varients.length > 0 ? "hidden" : ""}>
                <CardHeader>
                  <CardTitle>Price</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid gap-3">
                    <Label htmlFor="stockQuantity">Stock</Label>
                    <Input
                      id="stockQuantity"
                      name="stockQuantity"
                      type="number"
                      className="w-full"
                    />
                  </div>
                </CardContent>
              </Card>
              <Card x-chunk="dashboard-07-chunk-1" className={varients.length > 0 ? "hidden" : ""}>
                <CardHeader>
                  <CardTitle>Predefined Attributes</CardTitle>
                </CardHeader>
                <CardContent>
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Name</TableHead>
                        <TableHead>Options</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {categorySpecificAttributes
                        .filter((attribute) => typeof attribute !== "string")
                        .filter((attribute) => attribute.isMandatoryForProduct)
                        .map((attribute, index) => (
                          <TableRow key={index} className="">
                            <TableCell className="align-top">
                              <Label>{attribute.attributeName}</Label>
                            </TableCell>
                            <TableCell>
                              <Label className="sr-only">Options</Label>
                              <Select
                                onValueChange={(value) => {
                                  const attrObj = predefinedAttributes.find(
                                    (attr) => attr.name === attribute.attributeName
                                  );
                                  if (attrObj) {
                                    attrObj.value = value;
                                    setPredefinedAttributes([...predefinedAttributes]);
                                  }
                                }}
                              >
                                <SelectTrigger
                                  aria-label="Select subcategory"
                                  className={"w-[180px]"}
                                >
                                  <SelectValue placeholder="Select subcategory" />
                                </SelectTrigger>
                                <SelectContent>
                                  {attribute.allowedValues.map((value, i: number) => (
                                    <SelectItem key={i} value={value}>
                                      {value}
                                    </SelectItem>
                                  ))}
                                </SelectContent>
                              </Select>
                            </TableCell>
                          </TableRow>
                        ))}
                    </TableBody>
                  </Table>
                </CardContent>
              </Card>
              <Card x-chunk="dashboard-07-chunk-1">
                <CardHeader>
                  <CardTitle>Additional attributes</CardTitle>
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
            </div>
          </div>

          {varients.map((varient, idx) => (
            <div
              className={`grid gap-4 md:grid-cols-[1fr_250px] lg:grid-cols-3 lg:gap-8 ${
                idx !== curVarient ? "hidden" : ""
              }`}
              key={idx}
            >
              <div className="grid auto-rows-max items-start gap-4 lg:col-span-2 lg:gap-8">
                <Card x-chunk="dashboard-07-chunk-1">
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
                                setVarients([...varients]);
                              }}
                            />
                          </TableCell>
                        </TableRow>
                        <TableRow>
                          <TableCell className="font-semibold">Discount Price</TableCell>
                          <TableCell>
                            <Input
                              id="stock-2"
                              type="number"
                              value={varient.price}
                              onChange={(e) => {
                                varient.price = Number.parseInt(e.target.value);
                                setVarients([...varients]);
                              }}
                            />
                          </TableCell>
                        </TableRow>
                        <TableRow>
                          <TableCell className="font-semibold">SKU</TableCell>
                          <TableCell>
                            <Input
                              id="sku"
                              name="sku"
                              type="text"
                              className="w-full"
                              value={varient.sku}
                              onChange={(e) => {
                                (varient.sku = e.target.value), setVarients([...varients]);
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
                    <CardTitle>Predefined Attributes</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>Name</TableHead>
                          <TableHead>Options</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {categorySpecificAttributes
                          .filter((attribute) => typeof attribute !== "string")
                          .filter((attribute) => attribute.isMandatoryForVariant)
                          .map((attribute, index) => (
                            <TableRow key={index} className="">
                              <TableCell className="align-top">
                                <Label>{attribute.attributeName}</Label>
                              </TableCell>
                              <TableCell>
                                <Label className="sr-only">Options</Label>
                                <Select
                                  onValueChange={(value) => {
                                    const attrObj = varient.predefinedAttributes.find(
                                      (attr) => attr.name === attribute.attributeName
                                    );
                                    if (attrObj) {
                                      attrObj.value = value;
                                      setVarients([...varients]);
                                    }
                                  }}
                                >
                                  <SelectTrigger
                                    aria-label="Select subcategory"
                                    className={"w-[180px]"}
                                  >
                                    <SelectValue placeholder="Select subcategory" />
                                  </SelectTrigger>
                                  <SelectContent>
                                    {attribute.allowedValues.map((value, i: number) => (
                                      <SelectItem key={i} value={value}>
                                        {value}
                                      </SelectItem>
                                    ))}
                                  </SelectContent>
                                </Select>
                              </TableCell>
                            </TableRow>
                          ))}
                      </TableBody>
                    </Table>
                  </CardContent>
                </Card>
                <Card x-chunk="dashboard-07-chunk-1">
                  <CardHeader>
                    <CardTitle>Additional Attributes</CardTitle>
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
                                  setVarients([...varients]);
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
                                  setVarients([...varients]);
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
                                  setVarients([...varients]);
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
                        setVarients([...varients]);
                      }}
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
                      onClick={() => {
                        varient.imageFiles = [];
                        setVarients([...varients]);
                      }}
                    />
                  </CardHeader>
                  <CardContent>
                    <div className="grid gap-2">
                      {varient.imageFiles && varient.imageFiles.length >= 1 && (
                        <div className="grid gap-2">
                          <Image
                            alt="Product image"
                            className="aspect-square w-full rounded-md object-cover"
                            height="300"
                            width="300"
                            src={URL.createObjectURL(varient.imageFiles[0])}
                          />
                        </div>
                      )}

                      <div className={`grid grid-flow-* gap-2 ${imageFiles ? "grid-cols-2" : ""}`}>
                        {varient.imageFiles &&
                          varient.imageFiles.slice(1).map((imageFile, index) => (
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
                              varient.imageFiles
                                ? "relative shadow-lg min-w-20"
                                : "shadow-sm min-h-80"
                            }`}
                          >
                            <Upload className="h-4 w-4 text-muted-foreground" />
                            <input
                              type="file"
                              name="image"
                              className="hidden"
                              onChange={(e) => onVarientImageFileChange(e, varient)}
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
          ))}

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
