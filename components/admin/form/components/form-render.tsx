import { tFormConfigMeta } from "@/app/(admin)/table/[model]/modelform";
import React from "react";
import { Control, FieldError, FieldErrors, UseFormRegister } from "react-hook-form";
import { FieldRenderer } from "./input-field-render";

interface FieldRendererProps {
  fields: tFormConfigMeta["fields"];
  register: UseFormRegister<any>;
  name: string;
  Pname?: string;
  imageFiles?: File[];
  errors: FieldErrors<Record<string, unknown>>;
  control: Control<Record<string, unknown>, unknown, Record<string, unknown>>;
}

const FormRender = ({ fields, register, control, errors }: FieldRendererProps) => {
  return (
    <div>
      {fields.map((field) => (
        <div key={field.name}>
          <div
            key={field.name}
            style={{ marginBottom: 16 }}
            className="w-full grid grid-cols-[0.5fr_2fr] gap-y-2"
          >
            <label className="items-center">{field.displayName ?? field.name}</label>
            <FieldRenderer field={field} register={register} control={control} name={field.name} />
            {errors[field.name] && (
              <div className="col-span-2">
                <p className="text-red-900 overflow-auto text-right">
                  {String(errors[field.name]?.message)}
                </p>
              </div>
            )}
          </div>
        </div>
      ))}
    </div>
  );
};

export default FormRender;
