import { FormFieldMeta, tFormConfigMeta } from "@/app/(admin)/table/[model]/modelform";
import { SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Select } from "@radix-ui/react-select";
import React, { useEffect, useState } from "react";
import { UseFormRegister } from "react-hook-form";

const SelectInput = ({
  name,
  selectOptions,
  register,
}: {
  name: string;
  selectOptions: FormFieldMeta["options"];
  register: UseFormRegister<any>;
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
    } else if (selectOptions) {
      setOptions(selectOptions);
    }
  }, [selectOptions]);
  return (
    <div>
      <Select {...register(name)}>
        <SelectTrigger className="w-[180px]">
          <SelectValue placeholder="Select subcategory" />
        </SelectTrigger>

        <SelectContent>
          {options.map((c, i) => (
            <SelectItem key={i} value={c.value || ""}>
              {c.name}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
};

export default SelectInput;
