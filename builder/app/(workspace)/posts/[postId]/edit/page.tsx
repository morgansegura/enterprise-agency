"use client";

import * as React from "react";
import { useParams } from "next/navigation";
import { useResolvedTenant } from "@/lib/hooks/use-resolved-tenant";
import { PostEditorScreen } from "./post-editor-screen";

export default function EditPostPage() {
  const { tenantId } = useResolvedTenant();
  const { postId } = useParams<{ postId: string }>();
  return <PostEditorScreen tenantId={tenantId!} postId={postId} />;
}
