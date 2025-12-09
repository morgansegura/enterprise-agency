import { redirect } from "next/navigation";
import { use } from "react";

export default function ClientPortalPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = use(params);
  // Redirect to pages - the primary workspace
  redirect(`/${id}/pages`);
}
