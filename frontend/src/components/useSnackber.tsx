import React, { useState, useCallback } from "react";
import { Snackbar as MuiSnackbar, Alert } from "@mui/material";

type SnackbarSeverity = "success" | "error" | "warning" | "info";

interface SnackbarOptions {
  message: string;
  severity: SnackbarSeverity;
  autoHideDuration?: number;
}

const useSnackbar = () => {
  const [snackbarState, setSnackbarState] = useState<{
    open: boolean;
    message: string;
    severity: SnackbarSeverity;
    autoHideDuration?: number;
  }>({
    open: false,
    message: "",
    severity: "info",
    autoHideDuration: 6000, // Default duration
  });

  const showSnackbar = useCallback((options: SnackbarOptions) => {
    setSnackbarState({
      open: true,
      message: options.message,
      severity: options.severity,
      autoHideDuration: options.autoHideDuration || 6000,
    });
  }, []);

  const closeSnackbar = useCallback(() => {
    setSnackbarState((prev) => ({ ...prev, open: false }));
  }, []);

  const Snackbar = (
    <MuiSnackbar
      open={snackbarState.open}
      autoHideDuration={snackbarState.autoHideDuration}
      onClose={closeSnackbar}
      anchorOrigin={{ vertical: "top", horizontal: "center" }}
    >
      <Alert
        onClose={closeSnackbar}
        severity={snackbarState.severity}
        variant="filled"
      >
        {snackbarState.message}
      </Alert>
    </MuiSnackbar>
  );

  return { showSnackbar, closeSnackbar, Snackbar };
};

export default useSnackbar;
