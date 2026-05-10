"use client";

import { Alert, Button, FormControl, FormLabel, Input, Stack, Tab, TabList, Tabs, Typography } from "@mui/joy";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { createClient } from "@/lib/supabase/browser";

type Mode = "signin" | "signup";

export function AuthForm({ next = "/" }: { next?: string }) {
  const router = useRouter();
  const [mode, setMode] = useState<Mode>("signin");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [pending, setPending] = useState(false);

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setPending(true);
    setError(null);
    setMessage(null);

    let result;
    try {
      const supabase = createClient();
      result =
        mode === "signin"
          ? await supabase.auth.signInWithPassword({ email, password })
          : await supabase.auth.signUp({
              email,
              password,
              options: {
                emailRedirectTo:
                  typeof window !== "undefined"
                    ? `${window.location.origin}/auth/callback`
                    : undefined,
              },
            });
    } catch (err) {
      setPending(false);
      setError(err instanceof Error ? err.message : "Supabase is not configured.");
      return;
    }

    setPending(false);

    if (result.error) {
      setError(result.error.message);
      return;
    }

    if (mode === "signup" && !result.data.session) {
      setMessage("Check your email to confirm your account, then sign in.");
      return;
    }

    router.push(mode === "signup" ? "/setup" : next);
    router.refresh();
  };

  return (
    <Stack component="form" onSubmit={handleSubmit} gap={2}>
      <Tabs
        value={mode}
        onChange={(_, value) => {
          if (value === "signin" || value === "signup") setMode(value);
        }}
      >
        <TabList>
          <Tab value="signin">Sign in</Tab>
          <Tab value="signup">Create account</Tab>
        </TabList>
      </Tabs>

      {error ? <Alert color="danger">{error}</Alert> : null}
      {message ? <Alert color="success">{message}</Alert> : null}

      <FormControl required>
        <FormLabel>Email</FormLabel>
        <Input
          type="email"
          value={email}
          autoComplete="email"
          onChange={(event) => setEmail(event.target.value)}
        />
      </FormControl>

      <FormControl required>
        <FormLabel>Password</FormLabel>
        <Input
          type="password"
          value={password}
          autoComplete={mode === "signin" ? "current-password" : "new-password"}
          onChange={(event) => setPassword(event.target.value)}
        />
      </FormControl>

      <Button type="submit" loading={pending}>
        {mode === "signin" ? "Sign in" : "Create account"}
      </Button>

      <Typography level="body-xs" textColor="text.tertiary">
        Google login is intentionally not enabled in this version.
      </Typography>
    </Stack>
  );
}
