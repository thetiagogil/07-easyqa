"use client";

import {
  Button,
  FormControl,
  FormHelperText,
  FormLabel,
  Input,
  Link,
  Stack,
  Typography,
} from "@mui/joy";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { AUTH_BUTTON_PROPS } from "@/shared/components/auth/auth-link-button";
import { ActionStatus } from "@/shared/components/action-status";
import { createClient } from "@/lib/supabase/browser";

type Mode = "signin" | "signup";

const minimumPasswordLength = 8;

export function AuthForm({ next = "/" }: { next?: string }) {
  const router = useRouter();
  const [mode, setMode] = useState<Mode>("signin");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [message, setMessage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [pending, setPending] = useState(false);

  const emailValue = email.trim().toLowerCase();
  const continuePath = `/auth/continue?next=${encodeURIComponent(next)}`;

  const switchMode = (value: Mode) => {
    setMode(value);
    setError(null);
    setMessage(null);
    setPassword("");
    setConfirmPassword("");
  };

  const validate = () => {
    if (!emailValue) return "Email is required.";
    if (password.length < minimumPasswordLength) {
      return `Password must be at least ${minimumPasswordLength} characters.`;
    }
    if (mode === "signup" && password !== confirmPassword) {
      return "Passwords do not match.";
    }

    return null;
  };

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const validationError = validate();
    if (validationError) {
      setError(validationError);
      return;
    }

    setPending(true);
    setError(null);
    setMessage(null);

    try {
      const supabase = createClient();
      const result =
        mode === "signin"
          ? await supabase.auth.signInWithPassword({ email: emailValue, password })
          : await supabase.auth.signUp({
              email: emailValue,
              password,
              options: {
                emailRedirectTo:
                  typeof window !== "undefined"
                    ? `${window.location.origin}/auth/callback?next=${encodeURIComponent(
                        continuePath,
                      )}`
                    : undefined,
              },
            });

      if (result.error) {
        setError(result.error.message);
        return;
      }

      if (mode === "signup" && !result.data.session) {
        setMessage(`Check ${emailValue} to confirm your account, then log in.`);
        return;
      }

      router.replace(continuePath);
      router.refresh();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Supabase is not configured.");
    } finally {
      setPending(false);
    }
  };

  return (
    <Stack gap={3}>
      <Stack gap={0.75}>
        <Typography level="h3">{mode === "signin" ? "log in" : "sign up"}</Typography>
        <Typography level="body-sm" textColor="neutral.500">
          {mode === "signin"
            ? "Use your email and password to continue."
            : "Use email and password. Profile setup comes next."}
        </Typography>
      </Stack>

      <Stack component="form" onSubmit={handleSubmit} gap={2}>
        <ActionStatus
          pending={pending}
          pendingMessage={mode === "signin" ? "Signing in..." : "Creating account..."}
          error={error ?? undefined}
          success={message ?? undefined}
        />

        <FormControl required>
          <FormLabel>Email</FormLabel>
          <Input
            type="email"
            value={email}
            autoComplete="email"
            placeholder="you@example.com"
            disabled={pending}
            onChange={(event) => setEmail(event.target.value)}
          />
        </FormControl>

        <FormControl required>
          <FormLabel>Password</FormLabel>
          <Input
            type="password"
            value={password}
            autoComplete={mode === "signin" ? "current-password" : "new-password"}
            placeholder="Enter your password"
            disabled={pending}
            onChange={(event) => setPassword(event.target.value)}
          />
          {mode === "signup" ? (
            <FormHelperText>Use a password you do not reuse elsewhere.</FormHelperText>
          ) : null}
        </FormControl>

        {mode === "signup" ? (
          <FormControl required>
            <FormLabel>Confirm password</FormLabel>
            <Input
              type="password"
              value={confirmPassword}
              autoComplete="new-password"
              placeholder="Confirm your password"
              disabled={pending}
              onChange={(event) => setConfirmPassword(event.target.value)}
            />
          </FormControl>
        ) : null}

        <Button {...AUTH_BUTTON_PROPS} type="submit" loading={pending} fullWidth>
          {mode === "signin" ? "log in" : "sign up"}
        </Button>
      </Stack>

      <Typography level="body-sm" textAlign="center" textColor="neutral.500">
        {mode === "signin" ? "Need an account?" : "Already have an account?"}{" "}
        <Link
          component="button"
          type="button"
          onClick={() => switchMode(mode === "signin" ? "signup" : "signin")}
          sx={{ verticalAlign: "baseline" }}
        >
          {mode === "signin" ? "sign up" : "log in"}
        </Link>
      </Typography>
    </Stack>
  );
}
