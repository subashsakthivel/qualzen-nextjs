"use client";

import * as React from "react";
import { Card, CardTitle, CardHeader, CardContent } from "@/components/ui/card";
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
import { RefreshCcwIcon, Upload } from "lucide-react";
import { Textarea } from "@/components/ui/textarea";
import DataClientAPI from "@/util/client/data-client-api";
import Image from "next/image";
import { v4 as uuidv4 } from "uuid";
import FormatUtil from "@/util/formetUtil";
import { CommonUtil } from "@/util/util";

const model = "category";

const CategoryForm = ({
  categories,
  category,
}: {
  categories: TCategory[];
  category?: TCategory;
}) => {
  const router = useRouter();
  const [imageFile, setImageFile] = React.useState<File | undefined>(undefined);

  const mutation = useMutation({
    mutationFn: async(request: FormData) => {
      if (category) {
        return await DataClientAPI.patchData({modelName: model , request})
      } else {
        return await DataClientAPI.saveData({modelName: model , request})
      }
    },
    onSuccess: () => router.push("/table/category"),
  });

  const onImageFileChange = (ev: React.ChangeEvent<HTMLInputElement>) => {
    if(category?.image) {
      category.image = "/#";
    }
    if (!ev.target.files?.length) return;
    setImageFile(ev.target.files[0]);
  };

  const handleCreatePost = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const formData = new FormData(event.currentTarget);
    const imageName =  uuidv4();
    const parentCategory = formData.get("parentCategory") as string;

    const data: TCategory = {
      name: formData.get("name") as string,
      image: imageName,
      description: formData.get("description") as string,
      parentCategory: !parentCategory || parentCategory === "none" ? null : parentCategory,
    };
    const request = new FormData();
    if(category && category._id) {
      request.append("id", category._id);
      request.append("opeation", "UPDATE_DATA_V1.2");
    } else {
      request.append("opeation", "SAVE_DATA");
    }
  
    if (imageFile) {
      const fileOperation = [];
      fileOperation.push({ path: "image", multi: false });
      request.append("fileOperation", JSON.stringify(fileOperation));
      request.append(imageName, imageFile);
    }
    
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
                      src={FormatUtil.getFormat(category?.image)==="url" ? category?.image! : URL.createObjectURL(imageFile)}
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
