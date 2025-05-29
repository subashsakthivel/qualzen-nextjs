import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import React from "react";

function SelectValueFromList({
  name,
  list,
}: {
  name: string;
  list: { name: string; _id: string }[];
}) {
  return (
    <Select name={name}>
      <SelectTrigger aria-label="Select subcategory" className={"w-[180px]"}>
        <SelectValue placeholder="Select subcategory" />
      </SelectTrigger>
      <SelectContent>
        {list.map((value, i: number) => (
          <SelectItem key={i} value={value._id}>
            {value.name}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
}

export default SelectValueFromList;
