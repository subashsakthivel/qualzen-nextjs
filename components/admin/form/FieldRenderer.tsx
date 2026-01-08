"use client";
import { tFormConfigMeta } from "@/app/(admin)/table/[model]/modelform";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { Input } from "@/components/ui/input";
import { Popover, PopoverTrigger, PopoverContent } from "@/components/ui/popover";
import { Switch } from "@/components/ui/switch";
import { Textarea } from "@/components/ui/textarea";
import { cn } from "@/lib/utils";
import { CalendarIcon } from "lucide-react";
import { format } from "date-fns";
import { UseFormGetValues, UseFormRegister, UseFormSetValue } from "react-hook-form";

interface FieldRendererProps {
  field: tFormConfigMeta["fields"][0];
  register: UseFormRegister<any>;
  setValue: UseFormSetValue<any>;
  getValues: UseFormGetValues<Record<string, unknown>>;
}

export function FieldRenderer({ field, register, setValue, getValues }: FieldRendererProps) {
  const label = field.displayName ?? field.name;

  switch (field.type) {
    case "text":
    case "link":
    case "unique":
      return (
        <>
          <label>{label}</label>
          <Input type="text" {...register(field.name)} />
        </>
      );

    case "number":
      return (
        <>
          <label>{label}</label>
          <Input type="number" {...register(field.name)} min={0} defaultValue={0} />
        </>
      );

    case "textarea":
      return (
        <>
          <label>{label}</label>
          <Textarea {...register(field.name)} />
        </>
      );

    case "bool":
      return (
        <>
          <label>{label}</label>
          <Switch {...register(field.name)} />
        </>
      );

    case "date":
      return (
        <>
          <label>{label}</label>

          <Popover>
            <PopoverTrigger asChild>
              <Button
                variant={"outline"}
                className={cn("w-[280px] justify-start text-left font-normal")}
              >
                <CalendarIcon className="mr-2 h-4 w-4" />
                <>
                  {getValues(field.name) ? (
                    format(getValues(field.name) as string, "PPP")
                  ) : (
                    <span>Pick a date</span>
                  )}
                </>
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0">
              <Calendar mode="single" {...register(field.name)} initialFocus />
            </PopoverContent>
          </Popover>
        </>
      );

    case "select":
      return (
        <>
          <label>{label}</label>
          {field.options && (
            <select {...register(field.name)}>
              <option value="">Select</option>
              {field.options.map((opt) => (
                <option key={opt.value} value={opt.value}>
                  {opt.name}
                </option>
              ))}
            </select>
          )}
        </>
      );

    case "json":
      return (
        <>
          <label>{label}</label>
          <Textarea placeholder='{"key":"value"}' {...register(field.name)} />
        </>
      );

    case "image":
    case "images":
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
            multiple={field.type !== "image"}
          />
        </>
      );

    default:
      return null;
  }
}
