"use client";
import { tFormConfigMeta } from "@/app/(admin)/table/[model]/modelform";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { Input } from "@/components/ui/input";
import { Popover, PopoverTrigger, PopoverContent } from "@/components/ui/popover";
import { Switch } from "@/components/ui/switch";
import { Textarea } from "@/components/ui/textarea";
import { CalendarIcon, Upload } from "lucide-react";
import { format } from "date-fns";
import { Control, Controller, UseFormRegister } from "react-hook-form";
import { Card, CardContent } from "@/components/ui/card";
import Image from "next/image";
import SelectInput from "./select-input";
import SubFormArray from "./subformarray";

interface FieldRendererProps {
  field: tFormConfigMeta["fields"][0];
  register: UseFormRegister<any>;
  name: string;
  Pname?: string;
  imageFiles?: File[];
  control: Control<Record<string, unknown>, unknown, Record<string, unknown>>;
}

export function FieldRenderer({
  field,
  register,
  control,
  name,
  imageFiles,
  Pname,
}: FieldRendererProps) {
  const required = field.required ?? true;
  const type = field.type ?? "text";

  switch (field.type) {
    case "text":
    case "link":
    case "unique":
    case "tags":
      return (
        <>
          <Input type="text" {...register(name)} required={required} />
          <span className="text-red-700">{name}</span>
        </>
      );

    case "number":
      return (
        <>
          <Input
            type="number"
            {...register(name, { valueAsNumber: true })}
            min={0}
            defaultValue={0}
            required={required}
          />
          <span className="text-red-700">{name}</span>
        </>
      );

    case "textarea":
      return (
        <>
          <Textarea {...register(name)} required={required} />
          <span className="text-red-700">{name}</span>
        </>
      );

    case "bool":
      return (
        <>
          <Switch {...register(name)} required={required} />
          <span className="text-red-700">{name}</span>
        </>
      );

    case "date":
      return (
        <Controller
          name={name}
          control={control}
          render={({ field }) => (
            <Popover>
              <PopoverTrigger asChild>
                <Button
                  variant="outline"
                  className="data-[empty=true]:text-muted-foreground w-[280px] justify-start text-left font-normal"
                >
                  <CalendarIcon />
                  {field.value ? format(field.value as number, "PPP") : <span>Pick a date</span>}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0">
                <Calendar mode="single" onSelect={field.onChange} required={required} />
              </PopoverContent>
            </Popover>
          )}
        />
      );

    case "select":
      return (
        <>
          <SelectInput name={name} selectOptions={field.options} control={control} />
          <span className="text-red-700">{name}</span>
        </>
      );

    case "json":
      return (
        <>
          <Textarea placeholder='{"key":"value"}' {...register(name)} required={required} />
          <span className="text-red-700">{name}</span>
        </>
      );

    case "image":
    case "images":
      return (
        <Controller
          name={name}
          control={control}
          render={({ field }) => (
            <Card className="overflow-hidden">
              <CardContent>
                <div className="flex justify-center relative m-10">
                  {(field.value instanceof File || typeof field.value === "string") && (
                    <Image
                      alt="Product image"
                      className="aspect-square rounded-md object-cover"
                      height={300}
                      width={300}
                      src={
                        typeof field.value === "string"
                          ? field.value
                          : URL.createObjectURL(field.value)
                      }
                    />
                  )}
                  {Array.isArray(field.value) && (
                    <div className="grid grid-cols-2 gap-2 m-2">
                      {field.value.map((file: File | string, index: number) => (
                        <Image
                          key={index}
                          alt={`Product image ${index + 1}`}
                          className="aspect-square rounded-md object-cover"
                          height={300}
                          width={300}
                          src={typeof file === "string" ? file : URL.createObjectURL(file)}
                        />
                      ))}
                    </div>
                  )}

                  <label
                    className={`w-full flex flex-col items-center justify-center border border-dashed rounded-sm cursor-pointer text-sm ${
                      field.value ? "shadow-lg min-w-20" : "shadow-sm min-h-80"
                    }`}
                  >
                    <Upload className="h-4 w-4 text-muted-foreground" />
                    <input
                      type="file"
                      multiple={type === "images"}
                      className="hidden"
                      accept="image/png,image/gif,image/jpeg,image/jpg"
                      onChange={(e) => {
                        debugger;
                        if (type === "images") {
                          const file = Array.from(e.target.files || []);
                          if (file) field.onChange(file);
                        } else {
                          const file = e.target.files?.[0];
                          if (file) field.onChange(file);
                        }
                      }}
                    />
                  </label>
                </div>
              </CardContent>
            </Card>
          )}
        />
      );
    case "subFormArray":
      return (
        <div className="m-2  bg-gray-100 p-2">
          <SubFormArray
            Pfield={field}
            control={control}
            register={register}
            name={name}
            Pname={Pname}
          />
          <>
            <span className="text-red-700">{name}</span>
          </>
        </div>
      );

    default:
      return null;
  }
}
