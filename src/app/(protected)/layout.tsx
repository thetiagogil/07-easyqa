import { requireProfile } from "@/shared/server/auth";

export default async function ProtectedLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  await requireProfile();

  return children;
}
