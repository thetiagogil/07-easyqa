"use client";
import CloseIcon from "@mui/icons-material/Close";
import { IconButton, Snackbar } from "@mui/joy";
import type { ColorPaletteProp } from "@mui/joy/styles";
import { createContext, ReactNode, useContext, useEffect, useState } from "react";

type SnackbarStatus = ColorPaletteProp;

type SnackbarContextType = {
  showSnackbar: (msg: string, status?: SnackbarStatus, duration?: number) => void;
};

const SnackbarContext = createContext({} as SnackbarContextType);

export const SnackbarProvider = ({ children }: { children: ReactNode }) => {
  const [message, setMessage] = useState("");
  const [status, setStatus] = useState<SnackbarStatus>("primary");
  const [open, setOpen] = useState(false);

  const showSnackbar = (msg: string, status: SnackbarStatus = "primary") => {
    setMessage(msg);
    setStatus(status);
    setOpen(true);
  };

  useEffect(() => {
    if (open) {
      const timer = setTimeout(() => setOpen(false), 3000);
      return () => clearTimeout(timer);
    }
  }, [open]);

  return (
    <SnackbarContext.Provider value={{ showSnackbar }}>
      {children}
      <Snackbar
        variant="outlined"
        color={status}
        open={open}
        onClose={() => setOpen(false)}
        anchorOrigin={{ vertical: "top", horizontal: "right" }}
        endDecorator={
          <IconButton variant="plain" color={status} onClick={() => setOpen(false)}>
            <CloseIcon fontSize="small" />
          </IconButton>
        }
      >
        {message}
      </Snackbar>
    </SnackbarContext.Provider>
  );
};

export const useSnackbarContext = () => useContext(SnackbarContext);
