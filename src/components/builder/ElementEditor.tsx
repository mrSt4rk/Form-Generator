import React from "react";
import {
  Card,
  CardContent,
  Stack,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  TextField,
  Switch,
  FormControlLabel,
  Box,
  Typography,
  Chip,
  Divider,
} from "@mui/material";
import type { Choice, Element, ElementType } from "@/types";
import { ConditionBuilder } from "./ConditionBuilder";

const uid = () => Math.random().toString(36).slice(2, 10);

export function ElementEditor({
  element,
  onChange,
  allElements,
}: {
  element: Element;
  onChange: (el: Element) => void;
  allElements: Element[];
}) {
  const [local, setLocal] = React.useState<Element>(element);
  React.useEffect(() => setLocal(element), [element]);

  const update = <K extends keyof Element>(key: K, value: Element[K]) => {
    const current = { ...local, [key]: value } as Element;
    setLocal(current);
    onChange(current);
  };

  return (
    <Card variant="outlined" sx={{ mb: 2 }}>
      <CardContent>
        <Stack direction={{ xs: "column", sm: "row" }} spacing={2}>
          <FormControl sx={{ width: "500px" }}>
            <InputLabel id={`type-${element.id}`}>نوع</InputLabel>
            <Select
              labelId={`type-${element.id}`}
              label="نوع"
              value={local.type}
              onChange={(e) => update("type", e.target.value as ElementType)}
            >
              <MenuItem value="text">متن</MenuItem>
              <MenuItem value="checkbox">چک باکس</MenuItem>
            </Select>
          </FormControl>
          <TextField
            sx={{ width: "500px" }}
            label="عنوان"
            value={local.label}
            onChange={(e) => update("label", e.target.value)}
          />
          <FormControl>
            <FormControlLabel
              control={
                <Switch
                  checked={!!local.isRequired}
                  onChange={(e) => update("isRequired", e.target.checked)}
                />
              }
              label="اجباری"
            />
          </FormControl>
        </Stack>

        {local.type === "checkbox" && (
          <Box sx={{ mt: 2 }}>
            <Typography variant="body2" sx={{ mb: 1 }}>
              گزینه ها
            </Typography>
            <Stack direction="row" spacing={1} sx={{ flexWrap: "wrap" }}>
              {(local.choices ?? []).map((c: Choice) => (
                <Chip
                  key={c.id}
                  label={c.name}
                  onDelete={() =>
                    update(
                      "choices",
                      (local.choices ?? []).filter((x: Choice) => x.id !== c.id)
                    )
                  }
                />
              ))}
            </Stack>
            <Stack direction="row" spacing={1} sx={{ mt: 1 }}>
              <TextField
                size="small"
                label="گزینه ها"
                onKeyDown={(e) => {
                  const target = e.target as HTMLInputElement;
                  if (e.key === "Enter" && target.value.trim()) {
                    update("choices", [
                      ...(local.choices ?? []),
                      { id: uid(), name: target.value.trim() },
                    ]);
                    target.value = "";
                  }
                }}
              />
              <Typography
                variant="caption"
                sx={{ alignSelf: "center", direction: "rtl" }}
              >
                برای افزودن ، Enter را بزنید
              </Typography>
            </Stack>
          </Box>
        )}

        <Divider sx={{ my: 2 }} />
        <Typography variant="subtitle2" gutterBottom>
          افزودن شرط
        </Typography>
        <ConditionBuilder
          element={local}
          onChange={onChange}
          allElements={allElements}
        />
      </CardContent>
    </Card>
  );
}
