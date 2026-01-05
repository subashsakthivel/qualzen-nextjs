import { BaseField } from "@/app/(admin)/table/[model]/modelform";
import { useEffect, useState } from "react";
import { UseFormRegister, UseFormSetValue } from "react-hook-form";

interface FieldRendererProps {
  field: BaseField;
  register: UseFormRegister<any>;
  setValue: UseFormSetValue<any>;
}

export function FieldRenderer({ field, register, setValue }: FieldRendererProps) {
  const [options, setOptions] = useState(field.options ?? []);

  useEffect(() => {
    if (field.fetchOptions) {
      field.fetchOptions().then(setOptions);
    }
  }, [field]);

  const label = field.displayName ?? field.name;

  switch (field.type) {
    case "text":
    case "link":
    case "unique":
      return (
        <>
          <label>{label}</label>
          <input type="text" {...register(field.name)} />
        </>
      );

    case "number":
      return (
        <>
          <label>{label}</label>
          <input type="number" {...register(field.name, { valueAsNumber: true })} />
        </>
      );

    case "textarea":
      return (
        <>
          <label>{label}</label>
          <textarea {...register(field.name)} />
        </>
      );

    case "bool":
      return (
        <>
          <label>
            <input type="checkbox" {...register(field.name)} /> {label}
          </label>
        </>
      );

    case "date":
      return (
        <>
          <label>{label}</label>
          <input type="date" {...register(field.name)} />
        </>
      );

    case "select":
      return (
        <>
          <label>{label}</label>
          <select {...register(field.name)}>
            <option value="">Select</option>
            {options.map((opt) => (
              <option key={opt.value} value={opt.value}>
                {opt.name}
              </option>
            ))}
          </select>
        </>
      );

    case "json":
      return (
        <>
          <label>{label}</label>
          <textarea placeholder='{"key":"value"}' {...register(field.name)} />
        </>
      );

    case "image":
      return (
        <>
          <label>{label}</label>
          <input
            type="file"
            accept="image/*"
            onChange={(e) => {
              const file = e.target.files?.[0];
              setValue(field.name, file);
            }}
          />
        </>
      );

    default:
      return null;
  }
}
