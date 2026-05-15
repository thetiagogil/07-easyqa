"use client";

import LogoutIcon from "@mui/icons-material/Logout";
import { Button, type ButtonProps } from "@mui/joy";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { createClient } from "@/lib/supabase/browser";

type SignOutButtonProps = Omit<ButtonProps, "children" | "onClick"> & {
  label?: string;
};

export function SignOutButton({ label = "Log out", ...props }: SignOutButtonProps) {
  const router = useRouter();
  const [pending, setPending] = useState(false);

  const signOut = async () => {
    setPending(true);
    await createClient().auth.signOut();
    router.push("/");
    router.refresh();
  };

  return (
    <Button
      {...props}
      variant="outlined"
      color="neutral"
      loading={pending}
      onClick={signOut}
      endDecorator={<LogoutIcon />}
      sx={{ justifyContent: "space-between", ...props.sx }}
    >
      {label}
    </Button>
  );
}
