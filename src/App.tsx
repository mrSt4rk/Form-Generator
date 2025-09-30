import React from "react";
import {
  Box,
  Stack,
  Typography,
  Button,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
} from "@mui/material";
import { ThemeProvider } from "@mui/material/styles";
import { theme } from "./theme";
import { useFormsStore } from "./store/forms";
import { FormBuilder } from "./components/builder/FormBuilder";
import { FormRenderer } from "./components/renderer/FormRenderer";
import type { Form } from "./types";
import SnackbarHost from "./components/ui/snack/snackbar";

function ToolbarActions() {
  const { forms, activeFormId, setActiveForm, upsertForm, loadFromStorage } =
    useFormsStore();
  const active = forms.find((f: Form) => f.id === activeFormId) ?? null;
  const save = () => {
    if (!active) return;
    upsertForm({ ...active });
  };
  return (
    <Stack direction={{ xs: "column", sm: "row" }} spacing={2}>
      <Button variant="outlined" onClick={() => loadFromStorage()}>
        دریافت فرم
      </Button>
      <Button variant="outlined" onClick={save} disabled={!active}>
        ذخیره
      </Button>
      <FormControl size="small" sx={{ minWidth: 220 }}>
        <InputLabel id="active">فرم جاری</InputLabel>
        <Select
          labelId="active"
          label="Active form"
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
    </Stack>
  );
}

function SeedButton() {
  const { upsertForm, setActiveForm } = useFormsStore();
  const seed = async () => {
    const forms = await useFormsStore.getState().fetchForms();
    if (forms?.length) setActiveForm(forms[0].id);
    upsertForm(forms?.[0]);
  };
  return <Button onClick={seed}>پرکردن فرم نمونه</Button>;
}

export default function App() {
  const mounted = React.useRef(false);
  React.useEffect(() => {
    if (!mounted.current) {
      useFormsStore.getState().loadFromStorage();
      mounted.current = true;
    }
  }, []);
  const { forms, activeFormId } = useFormsStore();
  const active = forms.find((f: Form) => f.id === activeFormId) ?? null;

  return (
    <ThemeProvider theme={theme}>
      <Box sx={{ p: 3, maxWidth: 1100, mx: "auto" }}>
        <Typography variant="h5" gutterBottom>
          React Form Generator
        </Typography>
        <Stack spacing={2}>
          <Stack direction={{ xs: "column", md: "row" }} spacing={2}>
            <ToolbarActions />
            <SeedButton />
          </Stack>
          <FormBuilder />
          {active && <FormRenderer form={active} />}
        </Stack>
        <SnackbarHost />
      </Box>
    </ThemeProvider>
  );
}
