import { ClientLayout } from "@/components/layout/client-layout";

export default function ClientsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <ClientLayout>{children}</ClientLayout>;
}
