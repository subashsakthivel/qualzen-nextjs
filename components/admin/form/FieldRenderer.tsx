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
import {
  Control,
  Controller,
  UseFormGetValues,
  UseFormRegister,
  UseFormSetValue,
  UseFormWatch,
} from "react-hook-form";

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
          {...register(field.name)}
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
          {field.options && (
            <select {...register(field.name)} required={required}>
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
        <Textarea placeholder='{"key":"value"}' {...register(field.name)} required={required} />
      );

    case "image":
    case "images":
      return (
        <input
          type="file"
          accept="image/*"
          onChange={(e) => {
            const file = e.target.files?.[0];
            setValue(field.name, file);
          }}
          multiple={field.type !== "image"}
          required={required}
        />
      );

    default:
      return null;
  }
}
