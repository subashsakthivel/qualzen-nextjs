"use client";
import { tFormConfigMeta } from "@/app/(admin)/table/[model]/modelform";
import React from "react";
import { Control, useFieldArray, UseFormRegister } from "react-hook-form";
import { Button } from "@/components/ui/button";
import FormRender from "./form-render";
import { FieldRenderer } from "./input-field-render";

interface FieldRendererProps {
  Pfield: tFormConfigMeta["fields"][0];
  register: UseFormRegister<any>;
  name: string;
  Pname?: string;
  control: Control<Record<string, unknown>, unknown, Record<string, unknown>>;
}

const SubFormArray = ({ Pfield, register, control, name, Pname }: FieldRendererProps) => {
  const { fields, append, remove } = useFieldArray<Record<string, any>>({
    control,
    name: name,
  });

  function defaultValue() {
    debugger;
    console.log(fields);
    const obj: Record<string, any> = {};
    Pfield.subFormConfig?.fields.map((field) => {
      obj[field.name] = undefined;
    });
    return undefined;
  }

  function removeA(index: number) {
    debugger;
    remove(index);
  }
  return (
    <div>
      {fields.length > 0 &&
        fields.map((field, index) => (
          <div key={index} className="border mb-4 p-1">
            {Pfield.subFormConfig?.fields.map((field) => (
              <div key={field.name}>
                <div
                  key={field.name}
                  style={{ marginBottom: 16 }}
                  className="w-full grid grid-cols-[0.5fr_2fr] gap-y-2"
                >
                  <label className="items-center">{field.displayName ?? field.name}</label>
                  <FieldRenderer
                    field={field}
                    register={register}
                    control={control}
                    name={
                      name
                        ? `${name}.${index}.${field.name}`
                        : `${Pfield.name}.${index}.${field.name}`
                    }
                    Pname={`${name}`}
                  />
                </div>
              </div>
            ))}
            <div>
              <Button type="button" onClick={() => removeA(index)}>
                Remove
              </Button>
            </div>
          </div>
        ))}
      <Button type="button" onClick={() => append(defaultValue())}>
        Add
      </Button>
    </div>
  );
};

export default SubFormArray;
