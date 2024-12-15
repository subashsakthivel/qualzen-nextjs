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

function CategoryList({ name, type = "category" }: { name: string; type: "product" | "category" }) {
  const { data: categories = [], isLoading } = useQuery({
    queryKey: ["categories"],
    queryFn: async () => {
      const response = await axios.get("/api/categories");
      console.log("categories", response.data.data);
      return response.data.data;
    },
  });

  return (
    <Select name={name}>
      <SelectTrigger aria-label="Select subcategory" className={"w-[180px]"}>
        <SelectValue placeholder="Select subcategory" />
      </SelectTrigger>
      <SelectContent>
        {type === "category" && (
          <SelectItem key={"none"} value={"None"}>
            {"None"}
          </SelectItem>
        )}
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
