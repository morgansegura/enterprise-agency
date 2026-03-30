"use client";

import * as React from "react";
import { PageEditorScreen } from "./page-editor-screen";

export default function EditPagePage({
  params,
}: {
  params: Promise<{ id: string; pageId: string }>;
}) {
  const { id, pageId } = React.use(params);
  return <PageEditorScreen tenantId={id} pageId={pageId} />;
}
