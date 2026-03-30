"use client";

import * as React from "react";
import { PostEditorScreen } from "./post-editor-screen";

export default function EditPostPage({
  params,
}: {
  params: Promise<{ id: string; postId: string }>;
}) {
  const { id, postId } = React.use(params);
  return <PostEditorScreen tenantId={id} postId={postId} />;
}
