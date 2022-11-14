import { ExclamationCircleIcon, EyeIcon, EyeSlashIcon } from "@heroicons/react/24/outline";
import { hydratable, useFormField, useHydrated, useI18n } from "@microeinhundert/radonis";
import type { HTMLInputTypeAttribute } from "react";
import { useState } from "react";

import { clsx } from "../utils/string";

/*
 * Input
 */
interface InputProps extends HTMLProps<"input"> {
  type?: HTMLInputTypeAttribute;
  name: string;
  label: string;
  description?: string;
}

const initiallyHiddenTypes: HTMLInputTypeAttribute[] = ["password"];

function Input({ type: initialType = "text", className, ...restProps }: InputProps) {
  const { formatMessage } = useI18n();
  const field = useFormField(restProps);
  const hydrated = useHydrated();

  const isValueInitiallyHidden = initiallyHiddenTypes.includes(initialType);
  const [type, setType] = useState(initialType);

  const messages = {
    hideValue: formatMessage("shared.input.hideValue"),
    showValue: formatMessage("shared.input.showValue"),
  };

  return (
    <div>
      <label {...field.getLabelProps()} className="block text-sm font-medium text-gray-700">
        {field.label}
      </label>
      <div className="relative mt-1 rounded-md shadow-sm">
        <input
          {...field.getInputProps({ type, defaultValue: field.value })}
          className={clsx(
            "block w-full rounded-md pr-10 transition focus:outline-none sm:text-sm",
            field.error ? "border-red-300" : "border-gray-300",
            field.error ? "focus:border-red-500" : "focus:border-gray-500",
            field.error ? "focus:ring-red-500" : "focus:ring-emerald-500",
            field.error && "text-red-900 placeholder-red-300",
            className
          )}
        />
        {hydrated && field.value && isValueInitiallyHidden ? (
          <div className="absolute inset-y-0 right-0 flex items-center pr-3">
            <button
              type="button"
              onClick={() => setType((type) => (type === initialType ? "text" : initialType))}
            >
              {type !== initialType ? (
                <EyeSlashIcon aria-hidden="true" className="h-5 w-5" />
              ) : (
                <EyeIcon aria-hidden="true" className="h-5 w-5" />
              )}
              <span className="sr-only">
                {messages[type !== initialType ? "hideValue" : "showValue"]}
              </span>
            </button>
          </div>
        ) : (
          field.error && (
            <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-3">
              <ExclamationCircleIcon aria-hidden="true" className="h-5 w-5 text-red-500" />
            </div>
          )
        )}
      </div>
      {field.error ? (
        <span {...field.getErrorProps()} className="mt-2 block text-sm text-red-600">
          {field.error}
        </span>
      ) : (
        field.description && (
          <span {...field.getDescriptionProps()} className="mt-2 block text-sm text-gray-500">
            {field.description}
          </span>
        )
      )}
    </div>
  );
}

export default hydratable("Input", Input);
