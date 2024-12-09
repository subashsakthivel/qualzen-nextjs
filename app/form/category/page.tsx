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
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Textarea } from "@/components/ui/textarea";
import { Suspense, useEffect, useState } from "react";
import { IProperty } from "@/utils/VTypes";
import axios from "axios";
import CategoryList from "@/components/admin/categoryList";
import QueryClientHook from "@/components/admin/queryClientHook";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
export default function Dashboard() {
  const [imageSrc, setImageSrc] = useState<File | undefined>(undefined);

  function onImageSrcChange(ev: React.FormEvent<EventTarget>) {
    const { files } = ev.target as HTMLInputElement & {
      files: FileList;
    };
    console.log(typeof files[0]);
    setImageSrc(files[0]);
  }

  async function saveCategory(formData: FormData) {
    try {
      const categoryData = {
        name: formData.get("name"),
        description: formData.get("description"),
        parentCategory: formData.get("parentCategory"),
        isActive: true,
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

      if (response.data.success) {
        console.log("Category saved successfully:", response.data);
        return response.data;
      }
    } catch (error) {
      if (axios.isAxiosError(error)) {
        console.error("API Error:", error.response?.data);
        throw new Error(error.response?.data?.message || "Failed to save category");
      }
      console.error("Error saving category:", error);
      throw error;
    }
  }

  return (
    <QueryClientHook>
      <form className="mx-auto grid max-w-[59rem] flex-1 auto-rows-max gap-4" action={saveCategory}>
        {/* form heading */}
        <div className="flex items-center gap-4">
          <h1 className="flex-1 shrink-0 whitespace-nowrap text-xl font-semibold tracking-tight sm:grow-0">
            Category Form
          </h1>
          <div className="hidden items-center gap-2 md:ml-auto md:flex">
            <Button variant="outline" size="sm" type="button">
              Discard
            </Button>
            <Button size="sm" type="submit">
              Save Product
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
                  <CategoryList />
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
                      style={{ objectFit: "cover" }}
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
          <Button variant="outline" size="sm">
            Discard
          </Button>
          <Button size="sm">Save Category</Button>
        </div>
      </form>
    </QueryClientHook>
  );
}
