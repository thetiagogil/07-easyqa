import { requireProfile } from "@/lib/easyqa/data";

export default async function ProtectedLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  await requireProfile();

  return children;
}
