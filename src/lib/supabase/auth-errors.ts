export function isStaleAuthSessionError(error: unknown) {
  if (!error || typeof error !== "object") return false;

  const authError = error as {
    code?: unknown;
    message?: unknown;
    status?: unknown;
  };

  return (
    authError.status === 400 &&
    authError.code === "refresh_token_not_found" &&
    typeof authError.message === "string" &&
    authError.message.includes("Invalid Refresh Token")
  );
}
