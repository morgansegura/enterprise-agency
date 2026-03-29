"use client";

import * as React from "react";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import { FileText, Layers, Plus, X } from "lucide-react";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { usePages } from "@/lib/hooks/use-pages";
import "./editor-sidebar.css";

type SidebarTab = "pages" | "layers" | "add" | null;

interface EditorSidebarProps {
  layersPanel: React.ReactNode;
  blocksPanel: React.ReactNode;
}

const RAIL_ITEMS: Array<{
  id: SidebarTab;
  icon: React.ElementType;
  label: string;
  group?: "top" | "bottom";
}> = [
  { id: "add", icon: Plus, label: "Add block", group: "top" },
  { id: "pages", icon: FileText, label: "Pages", group: "top" },
  { id: "layers", icon: Layers, label: "Layers", group: "top" },
];

const PANEL_TITLES: Record<string, string> = {
  pages: "Pages",
  layers: "Layers",
  add: "Blocks",
};

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
          <div key={i} className="h-8 bg-(--el-100) rounded animate-pulse" />
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
            <span
              className="editor-pages-item-status"
              data-status={page.status}
            >
              {page.status === "published" ? "Live" : "Draft"}
            </span>
          </button>
        );
      })}
      <Link href={`/${tenantId}/pages/new`} className="editor-pages-add">
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
  const [activeTab, setActiveTab] = React.useState<SidebarTab>("layers");

  // Switch to Layers tab after adding a block
  React.useEffect(() => {
    const handleBlockAdded = () => setActiveTab("layers");
    window.addEventListener("add-block", handleBlockAdded);
    return () => window.removeEventListener("add-block", handleBlockAdded);
  }, []);

  const handleRailClick = (tab: SidebarTab) => {
    // Toggle: clicking same icon closes panel
    setActiveTab((prev) => (prev === tab ? null : tab));
  };

  const isOpen = activeTab !== null;

  return (
    <div className="editor-sidebar">
      {/* Icon Rail — always visible */}
      <div className="editor-sidebar-rail">
        {RAIL_ITEMS.map((item) => (
          <Tooltip key={item.id}>
            <TooltipTrigger asChild>
              <button
                type="button"
                className="editor-sidebar-rail-btn"
                data-active={activeTab === item.id || undefined}
                onClick={() => handleRailClick(item.id)}
              >
                <item.icon className="size-[18px]" />
              </button>
            </TooltipTrigger>
            <TooltipContent side="right" className="text-xs">
              {item.label}
            </TooltipContent>
          </Tooltip>
        ))}
      </div>

      {/* Expandable Panel */}
      <div
        className="editor-sidebar-panel"
        data-collapsed={!isOpen || undefined}
      >
        {isOpen && (
          <>
            <div className="editor-sidebar-panel-header">
              <span className="editor-sidebar-panel-title">
                {PANEL_TITLES[activeTab!]}
              </span>
              <button
                type="button"
                className="editor-sidebar-panel-close"
                onClick={() => setActiveTab(null)}
                title="Close panel"
              >
                <X className="size-3.5" />
              </button>
            </div>
            <div className="editor-sidebar-panel-content">
              {activeTab === "pages" && <PagesPanel />}
              {activeTab === "layers" && layersPanel}
              {activeTab === "add" && blocksPanel}
            </div>
          </>
        )}
      </div>
    </div>
  );
}
