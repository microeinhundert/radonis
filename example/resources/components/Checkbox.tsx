import { hydratable, useFormField } from "@microeinhundert/radonis";

import { clsx } from "../utils/string";

/*
 * Checkbox
 */
interface CheckboxProps extends HTMLProps<"input"> {
  type?: never;
  name: string;
  label: string;
  description?: string;
}

function Checkbox({ className, ...restProps }: CheckboxProps) {
  const field = useFormField(restProps);

  return (
    <div>
      <div className="relative flex items-start gap-3">
        <div className="flex h-5 items-center">
          <input
            {...field.getInputProps({
              type: "checkbox",
              value: "true",
              defaultChecked: !!field.value,
            })}
            className={clsx(
              "h-4 w-4 rounded transition",
              field.error ? "text-red-600" : "text-emerald-600",
              field.error ? "border-red-300" : "border-gray-300",
              field.error ? "focus:ring-red-500" : "focus:ring-emerald-500",
              className
            )}
          />
        </div>
        <div className="text-sm">
          <label {...field.getLabelProps()} className="font-medium text-gray-700">
            {field.label}
          </label>
          {field.description && (
            <span {...field.getDescriptionProps()} className="text-gray-500">
              {field.description}
            </span>
          )}
        </div>
      </div>
      {field.error && (
        <span {...field.getErrorProps()} className="mt-2 block text-sm text-red-600">
          {field.error}
        </span>
      )}
    </div>
  );
}

export default hydratable("Checkbox", Checkbox);
