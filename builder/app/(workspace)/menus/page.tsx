"use client";

import * as React from "react";
import { useRouter } from "next/navigation";
import {
  useMenus,
  useDeleteMenu,
  useDuplicateMenu,
  useSaveMenuToLibrary,
  type Menu,
} from "@/lib/hooks/use-menus";
import {
  ContentList,
  type ColumnDef,
  type MenuAction,
} from "@/components/layout/content-list";
import { Menu as MenuIcon, BookmarkPlus } from "lucide-react";
import { toast } from "sonner";
import { useResolvedTenant } from "@/lib/hooks/use-resolved-tenant";

import "./menus.css";

const typeLabels: Record<string, string> = {
  horizontal: "Horizontal",
  vertical: "Vertical",
  dropdown: "Dropdown",
  mega: "Mega Menu",
};

type MenuItem = Menu & { title: string };

export default function MenusPage() {
  const { tenantId } = useResolvedTenant();
  const id = tenantId!;
  const router = useRouter();

  const { data: menus, isLoading, error } = useMenus(id);
  const deleteMenu = useDeleteMenu(id);
  const duplicateMenu = useDuplicateMenu(id);
  const saveToLibrary = useSaveMenuToLibrary(id);

  const menuItems = React.useMemo(
    () => menus?.map((m) => ({ ...m, title: m.name })) || undefined,
    [menus],
  );

  const handleDelete = async (menu: MenuItem) => {
    if (menu.isDefault) {
      toast.error(
        "Cannot delete the default menu. Set another as default first.",
      );
      return;
    }
    if (!confirm(`Delete "${menu.name}"? This action cannot be undone.`))
      return;
    try {
      await deleteMenu.mutateAsync(menu.id);
      toast.success(`"${menu.name}" deleted`);
    } catch {
      toast.error("Failed to delete menu");
    }
  };

  const handleDuplicate = async (menu: MenuItem) => {
    try {
      await duplicateMenu.mutateAsync({ id: menu.id });
      toast.success(`"${menu.name}" duplicated`);
    } catch {
      toast.error("Failed to duplicate menu");
    }
  };

  const handleSaveToLibrary = async (menu: MenuItem) => {
    try {
      await saveToLibrary.mutateAsync({ id: menu.id });
      toast.success("Menu saved to library");
    } catch {
      toast.error("Failed to save to library");
    }
  };

  const formatDate = (dateString?: string) => {
    if (!dateString) return "\u2014";
    const d = new Date(dateString);
    const now = new Date();
    const diff = now.getTime() - d.getTime();
    const days = Math.floor(diff / (1000 * 60 * 60 * 24));
    if (days === 0) return "Today";
    if (days === 1) return "Yesterday";
    if (days < 7) return `${days}d ago`;
    return d.toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: d.getFullYear() !== now.getFullYear() ? "numeric" : undefined,
    });
  };

  const extraActions: MenuAction<MenuItem>[] = [
    {
      label: "Save to Library",
      icon: BookmarkPlus,
      onClick: handleSaveToLibrary,
    },
  ];

  const columns: ColumnDef<MenuItem>[] = [
    {
      key: "name",
      header: "Name",
      headerClassName: "content-table-header-cell-title",
      cellClassName: "content-table-cell-title",
      render: (m) => (
        <span className="content-table-cell-title-text">{m.name}</span>
      ),
    },
    {
      key: "slug",
      header: "Slug",
      headerClassName: "content-table-header-cell-slug",
      cellClassName: "content-table-cell-slug",
      render: (m) => (
        <span className="content-table-cell-slug-text">/{m.slug}</span>
      ),
    },
    {
      key: "type",
      header: "Type",
      headerClassName: "menus-col-type",
      cellClassName: "menus-col-type",
      render: (m) => (
        <span className="menus-type-text">{typeLabels[m.type] || m.type}</span>
      ),
    },
    {
      key: "default",
      header: "Default",
      headerClassName: "menus-col-default",
      cellClassName: "menus-col-default",
      render: (m) =>
        m.isDefault ? (
          <span className="menus-default-badge">Default</span>
        ) : null,
    },
    {
      key: "updated",
      header: "Updated",
      headerClassName: "content-table-header-cell-date",
      cellClassName: "content-table-cell-date",
      render: (m) => (
        <span className="content-table-cell-date-text">
          {formatDate(m.updatedAt)}
        </span>
      ),
    },
  ];

  return (
    <div className="menus-page">
      <ContentList<MenuItem>
        title="Menus"
        singularName="Menu"
        pluralName="menus"
        icon={MenuIcon}
        items={menuItems}
        isLoading={isLoading}
        error={error}
        onCreate={() => router.push("/menus/new")}
        onEdit={(m) => router.push(`/menus/${m.id}/edit`)}
        onDelete={handleDelete}
        onDuplicate={handleDuplicate}
        menuActions={extraActions}
        columns={columns}
        showStatus={false}
        searchFields={["title", "slug"]}
      />
    </div>
  );
}
