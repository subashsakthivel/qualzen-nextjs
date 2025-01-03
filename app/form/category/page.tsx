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
import { Textarea } from "@/components/ui/textarea";
import { useState } from "react";
import axios from "axios";
import CategoryList from "@/components/admin/categoryList";
import QueryClientHook from "@/components/admin/queryClientHook";
import { useToast } from "@/hooks/use-toast";
import { redirect } from "next/navigation";

//https://nextjs.org/docs/app/building-your-application/data-fetching/server-actions-and-mutations
//refer this above for server form component
export default function Dashboard() {
  const [imageSrc, setImageSrc] = useState<File | undefined>(undefined);
  const { toast } = useToast();

  function onImageSrcChange(ev: React.FormEvent<EventTarget>) {
    const { files } = ev.target as HTMLInputElement & {
      files: FileList;
    };
    setImageSrc(files[0]);
  }

  async function saveCategory(formData: FormData) {
    try {
      const categoryData = {
        name: formData.get("name"),
        description: formData.get("description"),
        parentCategory: formData.get("parentCategory"),
      };

      const finalFormData = new FormData();
      finalFormData.append("categoryData", JSON.stringify(categoryData));
      finalFormData.append("operation", "save");

      if (imageSrc) {
        finalFormData.append("image", imageSrc);
      }

      const response = await axios.post("/api/categories", finalFormData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      if (response.status === 200) {
        toast({
          title: "Category saved successfully",
        });
        redirect("/categories");
      }
    } catch (error) {
      if (axios.isAxiosError(error)) {
        toast({
          title: "Something issue",
          variant: "destructive",
        });
        console.error("API Error:", error.response?.data);
        throw new Error(error.response?.data?.message || "Failed to save category");
      }
      console.error("Failed to save :", error);
    }
  }

  return (
    <QueryClientHook>
      <form className="mx-auto grid max-w-[59rem] flex-1 auto-rows-max gap-4" action={saveCategory}>
        {/* form heading */}
        <div className="flex items-center gap-4 m-2">
          <h1 className="flex-1 shrink-0 whitespace-nowrap text-xl font-semibold tracking-tight sm:grow-0">
            Category Form
          </h1>
          <div className="hidden items-center gap-2 md:ml-auto md:flex">
            <Button size="sm" type="submit">
              Save Category
            </Button>
          </div>
        </div>
        <div className="grid gap-4 lg:gap-8 lg:grid-cols-2">
          {/* card details */}
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
                    required
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
                  <Label htmlFor="subcategory">Parent Category (optional)</Label>
                  <CategoryList name="subcategory" type="category" />
                </div>
              </div>
            </CardContent>
          </Card>
          {/* card image */}
          <Card className="overflow-hidden " x-chunk="dashboard-07-chunk-4">
            <CardHeader>
              <CardTitle>Category Image</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex justify-center relative">
                <label
                  className={`w-full min-h-96  text-center flex flex-col items-center cursor-pointer justify-center text-sm  rounded-sm   ${
                    imageSrc ? "relative shadow-lg" : "border border-dashed shadow-sm"
                  }`}
                >
                  {imageSrc ? (
                    <Image
                      src={URL.createObjectURL(imageSrc)}
                      alt="category image"
                      className="rounded-sm border shadow-sm"
                      fill
                      style={{ objectFit: "contain" }}
                    />
                  ) : (
                    <Upload className="h-4 w-4 text-muted-foreground" />
                  )}
                  <input
                    type="file"
                    className="hidden"
                    name="categoryImage"
                    onChange={onImageSrcChange}
                    accept="image/png, image/gif, image/jpeg"
                  />
                </label>
              </div>
            </CardContent>
          </Card>
        </div>
        <div className="flex items-center justify-center gap-2 md:hidden">
          <Button size="sm" type="submit">
            Save Category
          </Button>
        </div>
      </form>
    </QueryClientHook>
  );
}
