import React from "react";
import {
  Card,
  CardContent,
  Typography,
  Box,
  Stack,
  TextField,
  FormControl,
  FormGroup,
  FormControlLabel,
  Switch,
  FormHelperText,
  Button,
} from "@mui/material";
import {
  useForm,
  Controller,
  FormProvider,
  type Resolver,
  type FieldError,
} from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import type { Form, Element, Choice } from "@/types";
import { evaluateVisibility } from "@/util/visibility";
import { buildValidationSchema } from "@/util/validation";
import { useSnackbar } from "@/store/useSnackbar";

export function FormRenderer({ form }: { form: Form }) {
  const { show } = useSnackbar();
  const schema = React.useMemo(() => buildValidationSchema(form), [form]);

  type FormScalar = string | boolean | null | undefined;
  type FormValues = Record<string, FormScalar | string[]>;

  const defaultValues = React.useMemo(() => {
    const d: Record<string, unknown> = {};
    for (const el of form.elements) {
      if (el.type === "checkbox") d[el.id] = [];
      if (el.type === "text") d[el.id] = "";
    }
    return d;
  }, [form]);

  const methods = useForm<FormValues>({
    resolver: yupResolver(schema) as Resolver<FormValues>,
    defaultValues: defaultValues as FormValues,
  });

  const {
    control,
    handleSubmit,
    watch,
    formState: { errors },
  } = methods;
  const values = watch();

  const convertResult = (form: Form, data: FormValues) => {
    const out: Record<string, unknown> = {};
    for (const el of form.elements) {
      if (el.type === "text") {
        out[el.label] = (data[el.id] ?? "") as string;
      } else if (el.type === "checkbox") {
        const selectedIds = Array.isArray(data[el.id])
          ? (data[el.id] as string[])
          : [];
        const names = (el.choices ?? [])
          .filter((c) => selectedIds.includes(c.id))
          .map((c) => c.name);
        out[el.label] = names;
      }
    }
    return out;
  };

  const onSubmit = (data: any) => {
    show(JSON.stringify(convertResult(form, data)) as string, "success");
  };

  return (
    <FormProvider {...methods}>
      <Card variant="outlined">
        <CardContent>
          <Typography variant="h6" gutterBottom>
            {form.name}
          </Typography>
          <Box component="form" onSubmit={handleSubmit(onSubmit)}>
            <Stack spacing={2}>
              {form.elements.map((el: Element) => {
                const visible = evaluateVisibility(el.visibility, values);
                if (!visible) return null;
                if (el.type === "text") {
                  return (
                    <Controller
                      key={el.id}
                      name={el.id}
                      control={control}
                      render={({ field }) => (
                        <TextField
                          {...field}
                          label={el.label}
                          error={!!(errors[el.id] as FieldError | undefined)}
                          helperText={(errors[el.id]?.message as string) || ""}
                          fullWidth
                        />
                      )}
                    />
                  );
                }
                if (el.type === "checkbox") {
                  const sel: string[] = Array.isArray(values[el.id])
                    ? (values[el.id] as string[])
                    : [];
                  return (
                    <FormControl
                      key={el.id}
                      error={!!errors[el.id]}
                      component={Box}
                    >
                      <Typography variant="subtitle2" sx={{ mb: 1 }}>
                        {el.label}
                      </Typography>
                      <FormGroup row>
                        {(el.choices ?? []).map((c: Choice) => (
                          <FormControlLabel
                            key={c.id}
                            control={
                              <Controller
                                name={el.id}
                                control={control}
                                render={({ field }) => (
                                  <Switch
                                    checked={sel.includes(c.id)}
                                    onChange={(e) => {
                                      const checked = e.target.checked;
                                      const current = checked
                                        ? [...sel, c.id]
                                        : sel.filter((x: string) => x !== c.id);
                                      field.onChange(current);
                                    }}
                                  />
                                )}
                              />
                            }
                            label={c.name}
                          />
                        ))}
                      </FormGroup>
                      {(errors[el.id] as FieldError | undefined)?.message && (
                        <FormHelperText>
                          {(errors[el.id] as FieldError).message}
                        </FormHelperText>
                      )}
                    </FormControl>
                  );
                }
                return null;
              })}
              <Stack direction="row" spacing={2}>
                <Button variant="contained" type="submit">
                  ثبت
                </Button>
              </Stack>
            </Stack>
          </Box>
        </CardContent>
      </Card>
    </FormProvider>
  );
}
