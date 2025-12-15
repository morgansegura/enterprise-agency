"use client";

import * as React from "react";
import { useRouter } from "next/navigation";
import {
  useMenus,
  useDeleteMenu,
  useDuplicateMenu,
} from "@/lib/hooks/use-menus";
import { ContentList, type MenuAction } from "@/components/layout/content-list";
import { Menu as MenuIcon, Star, BookmarkPlus } from "lucide-react";
import { useSaveMenuToLibrary } from "@/lib/hooks";
import { toast } from "sonner";

interface MenuListItem {
  id: string;
  name: string;
  slug: string;
  type: string;
  isDefault?: boolean;
  updatedAt?: string;
}

export default function MenusPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const resolvedParams = React.use(params);
  const { id } = resolvedParams;
  const router = useRouter();
  const { data: menus, isLoading, error } = useMenus(id);
  const deleteMenu = useDeleteMenu(id);
  const duplicateMenu = useDuplicateMenu(id);
  const saveToLibrary = useSaveMenuToLibrary(id);

  const handleCreate = () => {
    router.push(`/${id}/menus/new`);
  };

  const handleEdit = (menu: MenuListItem) => {
    router.push(`/${id}/menus/${menu.id}/edit`);
  };

  const handleDelete = (menu: MenuListItem) => {
    if (confirm(`Delete "${menu.name}"?`)) {
      deleteMenu.mutate(menu.id);
    }
  };

  const handleDuplicate = (menu: MenuListItem) => {
    duplicateMenu.mutate({ id: menu.id });
  };

  const handleSaveToLibrary = (menu: MenuListItem) => {
    saveToLibrary.mutate(
      { id: menu.id },
      {
        onSuccess: () => {
          toast.success("Menu saved to library");
        },
      },
    );
  };

  // Transform menus to include title for ContentList
  const menuItems = menus?.map((menu) => ({
    ...menu,
    title: menu.name, // ContentList expects 'title'
    name: menu.name,
  }));

  // Additional menu actions
  const menuActions: MenuAction<MenuListItem>[] = [
    {
      label: "Save to Library",
      icon: BookmarkPlus,
      onClick: handleSaveToLibrary,
    },
  ];

  return (
    <ContentList<MenuListItem & { title: string }>
      title="Menus"
      singularName="Menu"
      pluralName="menus"
      icon={MenuIcon}
      items={menuItems}
      isLoading={isLoading}
      error={error}
      onCreate={handleCreate}
      onEdit={handleEdit}
      onDelete={handleDelete}
      onDuplicate={handleDuplicate}
      menuActions={menuActions}
      badges={[
        {
          show: (menu) => Boolean(menu.isDefault),
          icon: Star,
          className: "content-card-badge-default",
          title: "Default Menu",
        },
      ]}
    />
  );
}
