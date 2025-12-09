import { TenantProvider } from "@/components/providers/tenant-provider";

export default function ClientLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <TenantProvider>{children}</TenantProvider>;
}
