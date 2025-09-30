import { create } from "zustand";

export type SnackSeverity = "success" | "info" | "warning" | "error";

interface SnackbarState {
  open: boolean;
  message: string;
  severity: SnackSeverity;
  duration: number;
  show: (message: string, severity?: SnackSeverity, durationMs?: number) => void;
  hide: () => void;
}

export const useSnackbar = create<SnackbarState>((set) => ({
  open: false,
  message: "",
  severity: "info",
  duration: 4000,
  show: (message, severity = "info", durationMs = 4000) =>
    set({ open: true, message, severity, duration: durationMs }),
  hide: () => set({ open: false }),
}));