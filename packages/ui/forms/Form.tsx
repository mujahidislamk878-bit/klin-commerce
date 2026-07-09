"use client";

import { forwardRef, useState, type FormEvent } from "react";
import { cn } from "../../utils/cn";
import type { FormProps, FormField } from "../../types";
import { Button } from "../buttons/Button";
import { Input } from "./Input";
import { Textarea } from "./Textarea";
import { Select } from "./Select";
import { Checkbox } from "./Checkbox";
import { Toggle } from "./Toggle";

interface InternalFormState {
  [key: string]: string | boolean;
}

const Form = forwardRef<HTMLFormElement, FormProps>(
  (
    {
      submitLabel = "Submit",
      fields = [],
      onSubmit,
      successMessage,
      errorMessage,
      className,
      id,
      ...props
    },
    ref,
  ) => {
    const [formState, setFormState] = useState<InternalFormState>({});
    const [loading, setLoading] = useState(false);
    const [success, setSuccess] = useState<string | null>(null);
    const [error, setError] = useState<string | null>(null);

    const handleChange = (name: string, value: string | boolean) => {
      setFormState((prev) => ({ ...prev, [name]: value }));
    };

    const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
      e.preventDefault();
      setLoading(true);
      setSuccess(null);
      setError(null);

      if (onSubmit) {
        try {
          await new Promise<void>((resolve, reject) => {
            const handler = new Function("data", onSubmit) as (
              data: InternalFormState,
            ) => void | Promise<void>;
            const result = handler(formState);
            if (result && typeof result.then === "function") {
              result.then(resolve).catch(reject);
            } else {
              resolve();
            }
          });
          if (successMessage) setSuccess(successMessage);
        } catch {
          if (errorMessage) setError(errorMessage);
          else setError("An unexpected error occurred.");
        }
      }

      setLoading(false);
    };

    const renderField = (field: FormField) => {
      const key = field.name;
      const val = formState[key];

      switch (field.type) {
        case "text":
        case "email":
        case "password":
        case "number":
        case "tel":
        case "url":
        case "search":
          return (
            <Input
              key={key}
              label={field.label}
              placeholder={field.placeholder}
              type={field.type === "number" ? "number" : field.type as "text" | "email" | "password" | "tel" | "url" | "search"}
              required={field.required}
              value={(val as string) || ""}
              onChange={(e) => handleChange(key, e.target.value)}
            />
          );

        case "textarea":
          return (
            <Textarea
              key={key}
              label={field.label}
              placeholder={field.placeholder}
              required={field.required}
              value={(val as string) || ""}
              onChange={(e) => handleChange(key, e.target.value)}
            />
          );

        case "select":
          return (
            <Select
              key={key}
              label={field.label}
              placeholder={field.placeholder}
              options={field.options || []}
              required={field.required}
              value={(val as string) || ""}
              onChange={(e) => handleChange(key, e.target.value)}
            />
          );

        case "checkbox":
          return (
            <Checkbox
              key={key}
              label={field.label}
              required={field.required}
              checked={!!val}
              onCheckedChange={(checked) =>
                handleChange(key, checked === true)
              }
            />
          );

        case "toggle":
          return (
            <Toggle
              key={key}
              label={field.label}
              checked={!!val}
              onCheckedChange={(checked) => handleChange(key, checked)}
            />
          );

        default:
          return null;
      }
    };

    return (
      <form
        ref={ref}
        id={id}
        onSubmit={handleSubmit}
        className={cn("flex flex-col gap-4", className)}
        noValidate
        {...props}
      >
        {fields.map(renderField)}

        {success && (
          <div className="rounded-md bg-green-50 p-3 text-sm text-green-800 dark:bg-green-950 dark:text-green-200">
            {success}
          </div>
        )}

        {error && (
          <div
            className="rounded-md bg-destructive/10 p-3 text-sm text-destructive"
            role="alert"
          >
            {error}
          </div>
        )}

        <Button type="submit" loading={loading} disabled={loading}>
          {submitLabel}
        </Button>
      </form>
    );
  },
);

Form.displayName = "Form";

export { Form };
export default Form;