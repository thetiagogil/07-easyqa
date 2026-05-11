import { requireProfile } from "@/lib/server/data";

export default async function ProtectedLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  await requireProfile();

  return children;
}
