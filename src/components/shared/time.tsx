export function RelativeTime({ value }: { value: string }) {
  return <>{formatRelativeTime(value)}</>;
}

export function formatRelativeTime(value: string) {
  const date = new Date(value);
  const diffMs = date.getTime() - Date.now();
  const absMs = Math.abs(diffMs);
  const units: Array<[Intl.RelativeTimeFormatUnit, number]> = [
    ["year", 1000 * 60 * 60 * 24 * 365],
    ["month", 1000 * 60 * 60 * 24 * 30],
    ["day", 1000 * 60 * 60 * 24],
    ["hour", 1000 * 60 * 60],
    ["minute", 1000 * 60],
  ];

  const [unit, unitMs] = units.find(([, ms]) => absMs >= ms) ?? ["second", 1000];
  const valueInUnit = Math.round(diffMs / unitMs);

  return new Intl.RelativeTimeFormat("en", { numeric: "auto" }).format(valueInUnit, unit);
}
