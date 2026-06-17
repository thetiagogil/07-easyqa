export const safeRedirectPath = (
  value: string | null | undefined,
  fallback = "/",
) => {
  const trimmed = value?.trim();

  if (
    !trimmed ||
    !trimmed.startsWith("/") ||
    trimmed.startsWith("//") ||
    trimmed.includes("\\")
  ) {
    return fallback;
  }

  try {
    const parsed = new URL(trimmed, "http://easyqa.local");
    if (parsed.origin !== "http://easyqa.local") return fallback;

    return `${parsed.pathname}${parsed.search}${parsed.hash}`;
  } catch {
    return fallback;
  }
};

type OriginRequest = {
  headers: Headers;
  url: string;
};

const firstHeaderValue = (value: string | null) => {
  return value?.split(",")[0]?.trim() || null;
};

export const getRequestOrigin = (request: OriginRequest) => {
  const requestUrl = new URL(request.url);
  const host =
    firstHeaderValue(request.headers.get("host")) ??
    firstHeaderValue(request.headers.get("x-forwarded-host"));
  const protocol =
    firstHeaderValue(request.headers.get("x-forwarded-proto")) ??
    requestUrl.protocol.replace(":", "");

  if (!host || !["http", "https"].includes(protocol)) {
    return requestUrl.origin;
  }

  try {
    return new URL(`${protocol}://${host}`).origin;
  } catch {
    return requestUrl.origin;
  }
};
