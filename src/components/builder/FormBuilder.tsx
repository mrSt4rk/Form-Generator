import {
  Card,
  CardContent,
  Stack,
  Button,
  Divider,
  Typography,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
} from "@mui/material";
import { useFormsStore } from "@/store/forms";
import type { Element, ElementType, Form } from "@/types";
import { ElementEditor } from "./ElementEditor";

const uid = () => Math.random().toString(36).slice(2, 10);

export function FormBuilder() {
  const { forms, activeFormId, setActiveForm, upsertForm, deleteForm } =
    useFormsStore();
  const active = forms.find((f: Form) => f.id === activeFormId) ?? null;

  const createNewForm = () => {
    const f: Form = {
      id: uid(),
      name: `Untitled Form ${forms.length + 1}`,
      elements: [],
    };
    upsertForm(f);
    setActiveForm(f.id);
  };

  const updateElement = (el: Element) => {
    if (!active) return;
    const current: Form = {
      ...active,
      elements: active.elements.map((e: Element) => (e.id === el.id ? el : e)),
    };
    upsertForm(current);
  };

  const addElement = (type: ElementType) => {
    if (!active) return;
    const el: Element = {
      id: uid(),
      type,
      label: type === "text" ? "Text" : "Checkbox",
      isRequired: false,
      choices: undefined,
    };
    const current: Form = { ...active, elements: [...active.elements, el] };
    upsertForm(current);
  };

  const renameActive = (name: string) => {
    if (active) upsertForm({ ...active, name });
  };

  return (
    <Card variant="outlined">
      <CardContent>
        <Stack spacing={2}>
          <Stack
            direction={{ xs: "column", sm: "row" }}
            spacing={2}
            alignItems="center"
          >
            <Button variant="contained" onClick={createNewForm}>
              فرم جدید
            </Button>
            <FormControl fullWidth>
              <InputLabel id="form-sel">فرمها</InputLabel>
              <Select
                labelId="form-sel"
                label="Forms"
                value={activeFormId ?? ""}
                onChange={(e) => setActiveForm(String(e.target.value))}
              >
                {forms.map((f: Form) => (
                  <MenuItem key={f.id} value={f.id}>
                    {f.name}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
            <Button
              color="error"
              variant="outlined"
              disabled={!active}
              onClick={() => active && deleteForm(active.id)}
            >
              حذف
            </Button>
          </Stack>
          {active && (
            <>
              <TextField
                label="اسم فرم"
                value={active.name}
                onChange={(e) => renameActive(e.target.value)}
                fullWidth
              />
              <Stack direction="row" spacing={1}>
                <Button onClick={() => addElement("text")} variant="outlined">
                  اضافه کردن متن
                </Button>
                <Button
                  onClick={() => addElement("checkbox")}
                  variant="outlined"
                >
                  اضافه کردن چک باکس
                </Button>
              </Stack>
              <Divider />
              {active.elements.length === 0 && (
                <Typography variant="body2" color="text.secondary">
                  هیچ المانی اضافه نشده است
                </Typography>
              )}
              {active.elements.map((el: Element) => (
                <ElementEditor
                  key={el.id}
                  element={el}
                  onChange={updateElement}
                  allElements={active.elements}
                />
              ))}
            </>
          )}
        </Stack>
      </CardContent>
    </Card>
  );
}
