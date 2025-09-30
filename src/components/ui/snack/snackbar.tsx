import { Snackbar, Alert } from "@mui/material";
import { useSnackbar } from "@/store/useSnackbar";

export default function SnackbarHost() {
  const { open, message, severity, duration, hide } = useSnackbar();
  return (
    <Snackbar
      open={open}
      autoHideDuration={duration}
      onClose={hide}
      anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
    >
      <Alert
        onClose={hide}
        severity={severity}
        variant="filled"
        sx={{ width: "100%" }}
      >
        {message}
      </Alert>
    </Snackbar>
  );
}
