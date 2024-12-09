import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import React from "react";

function CategoryList() {
  const { data: categories = [], isLoading } = useQuery({
    queryKey: ["categories"],
    queryFn: async () => {
      const response = await axios.get("/api/categories");
      console.log("categories", response.data.data);
      return response.data.data;
    },
  });

  return (
    <Select name="parentCategory">
      <SelectTrigger aria-label="Select subcategory" className={"w-[180px]"}>
        <SelectValue placeholder="Select subcategory" />
      </SelectTrigger>
      <SelectContent>
        <SelectItem key={980} value={"None"}>
          {"None"}
        </SelectItem>
        {categories.map((category: { name: string; _id: string }, i: number) => (
          <SelectItem key={i} value={category._id}>
            {category.name}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
}

export default CategoryList;
