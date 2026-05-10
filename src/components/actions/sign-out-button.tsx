"use client";

import LogoutIcon from "@mui/icons-material/Logout";
import { Button } from "@mui/joy";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { createClient } from "@/lib/supabase/browser";

export function SignOutButton() {
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
      variant="outlined"
      color="neutral"
      loading={pending}
      onClick={signOut}
      endDecorator={<LogoutIcon />}
      sx={{ justifyContent: "space-between" }}
    >
      Sign out
    </Button>
  );
}
