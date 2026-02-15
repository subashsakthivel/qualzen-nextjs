"use client";
import { FormFieldMeta, tFormConfigMeta } from "@/app/(admin)/table/[model]/modelform";
import { SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Select } from "@radix-ui/react-select";
import React, { useEffect, useState } from "react";
import { Control, Controller, UseFormRegister } from "react-hook-form";

const SelectInput = ({
  name,
  selectOptions,
  control,
}: {
  name: string;
  selectOptions: FormFieldMeta["options"];
  control: Control<Record<string, unknown>, unknown, Record<string, unknown>>;
}) => {
  const [options, setOptions] = useState<
    {
      name: string;
      value: string;
    }[]
  >([]);

  useEffect(() => {
    if (typeof selectOptions === "function") {
      const fetchOptions = async () => {
        const options = await selectOptions();
        setOptions(options);
      };
      fetchOptions();
    } else if (selectOptions) {
      setOptions(selectOptions);
    }
  }, [selectOptions]);
  return (
    <div>
      {options && options.length > 0 ? (
        <Controller
          name={name}
          control={control}
          render={({ field }) => (
            <Select onValueChange={field.onChange}>
              <SelectTrigger className="w-[200px]">
                <SelectValue placeholder="Select category" />
              </SelectTrigger>

              <SelectContent>
                {options.map((c, i) => (
                  <SelectItem key={i} value={c.value || ""}>
                    {c.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          )}
        />
      ) : (
        <div className="underline">None</div>
      )}
    </div>
  );
};

export default SelectInput;
