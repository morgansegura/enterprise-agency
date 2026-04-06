"use client";

import * as React from "react";
import { useParams } from "next/navigation";
import { useResolvedTenant } from "@/lib/hooks/use-resolved-tenant";
import { PageEditorScreen } from "./page-editor-screen";

export default function EditPagePage() {
  const { tenantId } = useResolvedTenant();
  const { pageId } = useParams<{ pageId: string }>();
  return <PageEditorScreen tenantId={tenantId!} pageId={pageId} />;
}
