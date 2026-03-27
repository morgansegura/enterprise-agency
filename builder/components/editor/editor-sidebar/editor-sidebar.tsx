"use client";

import * as React from "react";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import { FileText, Layers, Plus } from "lucide-react";
import { usePages } from "@/lib/hooks/use-pages";
import "./editor-sidebar.css";

interface EditorSidebarProps {
  layersPanel: React.ReactNode;
  blocksPanel: React.ReactNode;
}

function PagesPanel() {
  const params = useParams();
  const router = useRouter();
  const tenantId = params?.id as string;
  const pageId = params?.pageId as string;
  const { data: pages, isLoading } = usePages(tenantId);

  if (isLoading) {
    return (
      <div className="p-2 space-y-1.5">
        {Array.from({ length: 5 }).map((_, i) => (
          <div
            key={i}
            className="h-8 bg-(--el-100) rounded animate-pulse"
          />
        ))}
      </div>
    );
  }

  if (!pages?.length) {
    return (
      <div className="p-4 text-center">
        <p className="text-[14px] text-(--el-500)">No pages yet</p>
      </div>
    );
  }

  return (
    <div className="editor-pages-list">
      {pages.map((page) => {
        const isActive = page.id === pageId;
        return (
          <button
            key={page.id}
            type="button"
            className="editor-pages-item"
            data-active={isActive || undefined}
            onClick={() => router.push(`/${tenantId}/pages/${page.id}/edit`)}
          >
            <FileText className="size-3.5 shrink-0" />
            <span className="editor-pages-item-title">{page.title}</span>
            <span className="editor-pages-item-status" data-status={page.status}>
              {page.status === "published" ? "Live" : "Draft"}
            </span>
          </button>
        );
      })}
      <Link
        href={`/${tenantId}/pages/new`}
        className="editor-pages-add"
      >
        <Plus className="size-3.5" />
        <span>New page</span>
      </Link>
    </div>
  );
}

export function EditorSidebar({
  layersPanel,
  blocksPanel,
}: EditorSidebarProps) {
  const [activeTab, setActiveTab] = React.useState<"pages" | "layers" | "add">(
    "layers",
  );

  // Switch to Layers tab after adding a block
  React.useEffect(() => {
    const handleBlockAdded = () => setActiveTab("layers");
    window.addEventListener("add-block", handleBlockAdded);
    return () => window.removeEventListener("add-block", handleBlockAdded);
  }, []);

  return (
    <div className="editor-sidebar">
      <div className="editor-sidebar-tabs">
        <button
          type="button"
          className="editor-sidebar-tab"
          data-active={activeTab === "pages" || undefined}
          onClick={() => setActiveTab("pages")}
        >
          <FileText className="size-3.5" />
          <span>Pages</span>
        </button>
        <button
          type="button"
          className="editor-sidebar-tab"
          data-active={activeTab === "layers" || undefined}
          onClick={() => setActiveTab("layers")}
        >
          <Layers className="size-3.5" />
          <span>Layers</span>
        </button>
        <button
          type="button"
          className="editor-sidebar-tab"
          data-active={activeTab === "add" || undefined}
          onClick={() => setActiveTab("add")}
        >
          <Plus className="size-3.5" />
          <span>Add</span>
        </button>
      </div>
      <div className="editor-sidebar-content">
        {activeTab === "pages" && <PagesPanel />}
        {activeTab === "layers" && layersPanel}
        {activeTab === "add" && blocksPanel}
      </div>
    </div>
  );
}
