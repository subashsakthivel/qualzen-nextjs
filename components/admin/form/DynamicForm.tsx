import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { FieldRenderer } from "./FieldRenderer";
import { tFormConfigMeta } from "@/app/(admin)/table/[model]/modelform";

interface DynamicFormProps {
  config: tFormConfigMeta;
  onSubmit: (data: any) => void;
}

export function DynamicForm({ config, onSubmit }: DynamicFormProps) {
  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(config.schema),
  });

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      {config.fields.map((field) => (
        <div key={field.name} style={{ marginBottom: 16 }}>
          <FieldRenderer field={field} register={register} setValue={setValue} />

          {errors[field.name] && (
            <p style={{ color: "red" }}>{String(errors[field.name]?.message)}</p>
          )}
        </div>
      ))}

      <button type="submit">Submit</button>
    </form>
  );
}
