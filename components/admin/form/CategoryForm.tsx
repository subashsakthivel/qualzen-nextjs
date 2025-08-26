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
import { useMutation } from "@tanstack/react-query";
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

const CategoryForm = ({ categoryListStr }: { categoryListStr: string }) => {
  const router = useRouter();
  const [attributes, setAttributes] = React.useState<TCategorySpecificAttributes[]>([]);
  const [imageFile, setImageFile] = React.useState<File | undefined>(undefined);
  const [categories, setCategories] = React.useState<TCategory[]>([]);
  const [existingAttributes, setExistingAttributes] = React.useState<TCategorySpecificAttributes[]>(
    []
  );

  const mutation = useMutation({
    mutationFn: (request: FormData) => DataClientAPI.saveData({ modelName: model, request }),
    onSuccess: () => router.push("/table/category"),
  });

  React.useEffect(() => {
    (async () => {
      const cats = await DataClientAPI.getData({
        modelName: "category",
        operation: "GET_DATA",
        request: {},
      });
      const attrs = await DataClientAPI.getData({
        modelName: "categoryspecificattributes",
        operation: "GET_DATA_MANY",
        request: {},
      });
      setCategories(cats.docs as TCategory[]);
      setExistingAttributes(attrs as TCategorySpecificAttributes[]);
    })();
  }, []);

  const onImageFileChange = (ev: React.ChangeEvent<HTMLInputElement>) => {
    if (!ev.target.files?.length) return;
    setImageFile(ev.target.files[0]);
  };

  const handleCreatePost = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!imageFile) return;

    const formData = new FormData(event.currentTarget);
    const imageName = uuidv4();
    const parentCategory = formData.get("parentCategory") as string;
    const productAttributes = attributes.map((attr) => (attr._id ? attr._id : attr));

    const data: TCategory = {
      name: formData.get("name") as string,
      image: imageName,
      description: formData.get("description") as string,
      parentCategory: !parentCategory || parentCategory === "none" ? null : parentCategory,
      attributes: productAttributes,
    };

    const fileOperation = [{ path: "image", multi: false }];
    const request = new FormData();
    request.append("operation", "SAVE_DATA");
    request.append("fileOperation", JSON.stringify(fileOperation));
    request.append("data", JSON.stringify(data));
    request.append(imageName, imageFile);
    debugger;
    mutation.mutate(request);
  };

  const handleKeyDown = (event: React.KeyboardEvent<HTMLFormElement>) => {
    if (
      event.key === "Enter" &&
      event.target instanceof HTMLElement &&
      event.target.tagName.toLowerCase() !== "textarea"
    ) {
      event.preventDefault();
    }
  };

  return (
    <div className="m-10 mb-52 space-y-24 p-10">
      <form
        className="grid flex-1 auto-rows-max gap-4"
        autoComplete="off"
        onSubmit={handleCreatePost}
        onKeyDown={handleKeyDown}
      >
        <div className="flex items-center gap-4">
          <h1 className="flex-1 text-xl font-semibold tracking-tight">Category Form</h1>
          <Button size="sm" type="submit" disabled={mutation.isPending} className="hidden md:flex">
            Save Category
          </Button>
        </div>

        <div className="grid gap-4 lg:gap-8">
          <div className="grid auto-rows-max gap-4 lg:col-span-2 lg:gap-8">
            {/* Category Details */}
            <Card>
              <CardHeader>
                <CardTitle>Category Details</CardTitle>
              </CardHeader>
              <CardContent className="grid gap-6">
                <div className="grid gap-3">
                  <Label htmlFor="name">Name</Label>
                  <Input id="name" name="name" placeholder="White Mens Baggy Shirt" />
                </div>
                <div className="grid gap-3">
                  <Label htmlFor="description">Description</Label>
                  <Textarea
                    name="description"
                    id="description"
                    placeholder="Detailed description of the product"
                    className="min-h-32"
                  />
                </div>
                <div className="grid gap-3">
                  <Label htmlFor="parentCategory">Parent Category</Label>
                  <Select name="parentCategory">
                    <SelectTrigger className="w-[180px]">
                      <SelectValue placeholder="Select subcategory" />
                    </SelectTrigger>
                    <SelectContent>
                      {categories.map((c, i) => (
                        <SelectItem key={i} value={c._id || ""}>
                          {c.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </CardContent>
            </Card>

            {/* Category Images */}
            <Card className="overflow-hidden">
              <CardHeader className="flex items-center justify-between">
                <CardTitle>Category Images</CardTitle>
                <RefreshCcwIcon
                  className="size-5 cursor-pointer"
                  onClick={() => setImageFile(undefined)}
                />
              </CardHeader>
              <CardContent>
                <div className="flex justify-center relative">
                  {imageFile && (
                    <Image
                      alt="Product image"
                      className="aspect-square rounded-md object-cover"
                      height={300}
                      width={300}
                      src={URL.createObjectURL(imageFile)}
                    />
                  )}
                  <label
                    className={`w-full flex flex-col items-center justify-center border border-dashed rounded-sm cursor-pointer text-sm ${
                      imageFile ? "shadow-lg min-w-20" : "shadow-sm min-h-80"
                    }`}
                  >
                    <Upload className="h-4 w-4 text-muted-foreground" />
                    <input
                      type="file"
                      name="image"
                      className="hidden"
                      onChange={onImageFileChange}
                      accept="image/png,image/gif,image/jpeg,image/jpg"
                    />
                  </label>
                </div>
              </CardContent>
            </Card>

            {/* Attributes */}
            <Card>
              <CardHeader>
                <CardTitle>Attributes</CardTitle>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead></TableHead>
                      <TableHead>Name</TableHead>
                      <TableHead>Type</TableHead>
                      <TableHead>Allowed Values</TableHead>
                      <TableHead>Mandatory For Product</TableHead>
                      <TableHead>Mandatory For Variant</TableHead>
                      <TableHead>Order</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {attributes.map((attr, index) => (
                      <TableRow key={index}>
                        <TableCell>
                          <Trash2Icon
                            className="h-3.5 w-3.5 cursor-pointer"
                            onClick={() => setAttributes(attributes.filter((_, i) => i !== index))}
                          />
                        </TableCell>
                        <TableCell>
                          <Input
                            value={attr.attributeName}
                            onChange={(e) => {
                              attr.attributeName = e.target.value;
                              setAttributes([...attributes]);
                            }}
                            disabled={!!attr._id}
                          />
                        </TableCell>
                        <TableCell>
                          <Select
                            value={attr.attributeType}
                            onValueChange={(v) => {
                              attr.attributeType =
                                v as TCategorySpecificAttributes["attributeType"];
                              setAttributes([...attributes]);
                            }}
                            disabled={!!attr._id}
                          >
                            <SelectTrigger className="w-[180px]">
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                              {["text", "number", "select", "checkbox", "radio"].map((type) => (
                                <SelectItem key={type} value={type}>
                                  {type.toUpperCase()}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        </TableCell>
                        <TableCell>
                          <TagInput
                            defaulttags={attr.allowedValues || []}
                            onTagValueChange={(tags) => {
                              if (!!attr._id) return;
                              attr.allowedValues = tags;
                              setAttributes([...attributes]);
                            }}
                            disabled={!!attr._id}
                          />
                        </TableCell>
                        <TableCell>
                          <Select
                            value={attr.isMandatoryForProduct ? "true" : "false"}
                            onValueChange={(v) => {
                              attr.isMandatoryForProduct = v === "true";
                              setAttributes([...attributes]);
                            }}
                            disabled={!!attr._id}
                          >
                            <SelectTrigger className="w-[180px]">
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="true">Yes</SelectItem>
                              <SelectItem value="false">No</SelectItem>
                            </SelectContent>
                          </Select>
                        </TableCell>
                        <TableCell>
                          <Select
                            value={attr.isMandatoryForVariant ? "true" : "false"}
                            onValueChange={(v) => {
                              attr.isMandatoryForVariant = v === "true";
                              setAttributes([...attributes]);
                            }}
                            disabled={!!attr._id}
                          >
                            <SelectTrigger className="w-[180px]">
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="true">Yes</SelectItem>
                              <SelectItem value="false">No</SelectItem>
                            </SelectContent>
                          </Select>
                        </TableCell>
                        <TableCell>
                          <Input
                            type="number"
                            value={attr.sortOrder}
                            min={0}
                            onChange={(e) => {
                              attr.sortOrder = Math.round(Number(e.target.value));
                              setAttributes([...attributes]);
                            }}
                            disabled={!!attr._id}
                          />
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
              <CardFooter className="justify-center border-t p-4 flex gap-4">
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
                  <PlusCircle className="h-3.5 w-3.5" /> Add Attribute
                </Button>
                <Select
                  onValueChange={(v) =>
                    setAttributes([...attributes, existingAttributes[Number(v)]])
                  }
                >
                  <SelectTrigger className="w-[180px]">
                    <SelectValue placeholder="Add Existing Attributes" />
                  </SelectTrigger>
                  <SelectContent>
                    {existingAttributes.map((val, i) => (
                      <SelectItem key={i} value={String(i)}>
                        {val.attributeName}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
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
