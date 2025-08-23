"use client";

import * as React from "react";
import { Card, CardTitle, CardHeader, CardContent, CardFooter } from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { useMutation, useQuery } from "@tanstack/react-query";
import { TCategory } from "@/schema/Category";
import { useRouter } from "next/navigation";
import { PlusCircle, RefreshCcwIcon, Trash2Icon, Upload } from "lucide-react";
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
import DataClientAPI from "@/util/client/data-client-api";
import Image from "next/image";
import { v4 as uuidv4 } from "uuid";

const model = "category";
const CategoryForm = () => {
  const router = useRouter();
  const [attributes, setAttributes] = React.useState<TCategorySpecificAttributes[]>([]);
  const [imageFile, setImageFile] = React.useState<File | undefined>(undefined);
  const [categories, setCategories] = React.useState<TCategory[]>([]);
  const [existingAttributes, setExistingAttributes] = React.useState<TCategorySpecificAttributes[]>(
    []
  );

  const mutation = useMutation({
    mutationFn: (request: FormData) => DataClientAPI.saveData({ modelName: model, request }),
    onSuccess: () => {
      router.push("/table/category");
    },
  });

  React.useEffect(() => {
    const getCategories = async () => {
      const result = await DataClientAPI.getData({
        modelName: "category",
        operation: "GET_DATA",
        request: {},
      });
      return result.docs as TCategory[];
    };
    const getCategoryAttributes = async () => {
      const result = await DataClientAPI.getData({
        modelName: "categoryspecificattributes",
        operation: "GET_DATA_MANY",
        request: {},
      });
      return result as TCategorySpecificAttributes[];
    };
    getCategories().then((data) => setCategories(data));
    getCategoryAttributes().then((data) => setExistingAttributes(data));
  }, []);

  function onImageFileChange(ev: React.FormEvent<EventTarget>) {
    debugger;
    const { files } = ev.target as HTMLInputElement & {
      files: FileList;
    };
    setImageFile(files[0]);
  }

  const handleCreatePost = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!imageFile) {
      return;
    }
    const formData = new FormData(event.currentTarget);
    const imageName = uuidv4();
    const parentCategory = formData.get("parentCategory") as string;
    const data: TCategory = {
      name: formData.get("name") as string,
      image: imageName,
      description: formData.get("description") as string,
      parentCategory: !parentCategory || parentCategory === "none" ? null : parentCategory,
      attributes,
    };
    const fileOperation = [
      {
        path: "image",
        multi: false,
      },
    ];
    const request = new FormData();
    request.append("operation", "SAVE_DATA");
    request.append("fileOperation", JSON.stringify(fileOperation));
    request.append("data", JSON.stringify(data));
    request.append(imageName, imageFile!);
    mutation.mutate(request);
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
    <div className="m-10 space-y-24 flex justify-center items-center p-10">
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
                    <Select name="parentCategory">
                      <SelectTrigger aria-label="Select subcategory" className={"w-[180px]"}>
                        <SelectValue placeholder="Select subcategory" />
                      </SelectTrigger>
                      <SelectContent>
                        {categories.map((value, i: number) => (
                          <SelectItem key={i} value={value._id || ""}>
                            {value.name}
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
                <CardTitle>Category Images</CardTitle>
                <RefreshCcwIcon
                  className="size-5 cursor-pointer"
                  onClick={() => setImageFile(undefined)}
                />
              </CardHeader>
              <CardContent>
                <div className="">
                  <div className="flex justify-center relative">
                    {imageFile && (
                      <div className="">
                        <Image
                          alt="Product image"
                          className="aspect-square w-full rounded-md object-cover"
                          height="300"
                          width="300"
                          src={URL.createObjectURL(imageFile)}
                        />
                      </div>
                    )}
                    <label
                      className={`w-full min-h-20 bg-secondary text-center border border-dashed flex flex-col items-center cursor-pointer justify-center text-sm  rounded-sm   ${
                        imageFile ? "relative shadow-lg min-w-20" : "shadow-sm min-h-80"
                      }`}
                    >
                      <Upload className="h-4 w-4 text-muted-foreground" />
                      <input
                        type="file"
                        name="image"
                        className="hidden"
                        onChange={onImageFileChange}
                        accept="image/png, image/gif, image/jpeg , image/jpg"
                      />
                    </label>
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
                      <TableRow key={index} className="justify-start disabled:*">
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
                            disabled={attribute._id ? true : false}
                          />
                        </TableCell>
                        <TableCell className="align-top">
                          <Label className="sr-only">Allowed values</Label>
                          <TagInput
                            defaulttags={attribute.allowedValues || []}
                            onTagValueChange={(tags: string[]) => {
                              attribute.allowedValues = tags;
                              setAttributes([...attributes]);
                            }}
                            disabled={attribute._id ? true : false}
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
                            disabled={attribute._id ? true : false}
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
                            disabled={attribute._id ? true : false}
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
                            disabled={attribute._id ? true : false}
                          />
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
              <CardFooter className="justify-center border-t p-4 flex">
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
                <div className="">
                  <Select
                    onValueChange={(value) =>
                      setAttributes([...attributes, existingAttributes[Number(value)]])
                    }
                  >
                    <SelectTrigger aria-label="Add Existing Attributes" className={"w-[180px]"}>
                      <SelectValue placeholder="Add Existing Attributes" />
                    </SelectTrigger>
                    <SelectContent>
                      {existingAttributes &&
                        existingAttributes.map((value, i) => (
                          <SelectItem key={i} value={i + ""}>
                            {value.attributeName}
                          </SelectItem>
                        ))}
                    </SelectContent>
                  </Select>
                </div>
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
