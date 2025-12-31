import { ClientLayout } from "@/components/layout/client-layout";
import { AgencyProvider } from "@/components/providers/agency-provider";

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <AgencyProvider>
      <ClientLayout>{children}</ClientLayout>
    </AgencyProvider>
  );
}
