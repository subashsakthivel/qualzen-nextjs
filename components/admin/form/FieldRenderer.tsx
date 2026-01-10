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
import {
  Control,
  Controller,
  UseFormRegister,
  UseFormSetValue,
  UseFormWatch,
} from "react-hook-form";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import Image from "next/image";
import { file } from "zod";
import FormatUtil from "@/util/formetUtil";
import { StaticImport } from "next/dist/shared/lib/get-img-props";

interface FieldRendererProps {
  field: tFormConfigMeta["fields"][0];
  register: UseFormRegister<any>;
  setValue: UseFormSetValue<any>;
  watch: UseFormWatch<Record<string, unknown>>;
  control: Control<Record<string, unknown>, unknown, Record<string, unknown>>;
}

export function FieldRenderer({ field, register, setValue, watch, control }: FieldRendererProps) {
  const label = field.displayName ?? field.name;
  const required = field.required ?? true;

  switch (field.type) {
    case "text":
    case "link":
    case "unique":
      return <Input type="text" {...register(field.name)} required={required} />;

    case "number":
      return (
        <Input
          type="number"
          {...register(field.name, { valueAsNumber: true })}
          min={0}
          defaultValue={0}
          required={required}
        />
      );

    case "textarea":
      return <Textarea {...register(field.name)} required={required} />;

    case "bool":
      return <Switch {...register(field.name)} required={required} />;

    case "date":
      return (
        <Controller
          name={field.name}
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
          {/* {field.options && typeof field.options !== "function" && Array.isArray(field.options) && (
            <select {...register(field.name)} required={false}>
              <option value="">Select</option>
              {field.options.map((opt) => (
                <option key={opt.value} value={opt.value}>
                  {opt.name}
                </option>
              ))}
            </select>
          )} */}
        </>
      );

    case "json":
      return (
        <Textarea placeholder='{"key":"value"}' {...register(field.name)} required={required} />
      );

    case "image":
    case "images":
      return (
        <Controller
          name={field.name}
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

                  <label
                    className={`w-full flex flex-col items-center justify-center border border-dashed rounded-sm cursor-pointer text-sm ${
                      field.value ? "shadow-lg min-w-20" : "shadow-sm min-h-80"
                    }`}
                  >
                    <Upload className="h-4 w-4 text-muted-foreground" />

                    <input
                      type="file"
                      className="hidden"
                      accept="image/png,image/gif,image/jpeg,image/jpg"
                      onChange={(e) => {
                        const file = e.target.files?.[0];
                        if (file) field.onChange(file);
                      }}
                    />
                  </label>
                </div>
              </CardContent>
            </Card>
          )}
        />
      );

    default:
      return null;
  }
}
