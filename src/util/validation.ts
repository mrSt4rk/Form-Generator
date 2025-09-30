import * as yup from "yup";
import type { Form } from "@/types";

export type FormValues = Record<string, string | string[] | undefined>;

type FieldSchema = yup.AnySchema;

export function buildValidationSchema(form: Form): yup.ObjectSchema<FormValues> {
  const shape: Record<string, FieldSchema> = {};

  form.elements.forEach((el) => {
    if (el.type === "text") {
      let s = yup.string().trim();
      if (el.isRequired) s = s.required("مقداری وارد نشده است");
      shape[el.id] = s;
    }
    if (el.type === "checkbox") {
      let a = yup.array().of(yup.string())
      if (el.isRequired) a = a.min(1, "یک گزینه را انتخاب کنید");
      shape[el.id] = a;
    }
  });

  return yup.object(shape) as yup.ObjectSchema<FormValues>;
}