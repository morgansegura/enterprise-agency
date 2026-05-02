"use client";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useMenus } from "@/lib/hooks/use-menus";
import { useResolvedTenant } from "@/lib/hooks/use-resolved-tenant";

interface MenuBlockData {
  _key: string;
  _type: "menu-block";
  data: {
    menuId?: string;
    variant?: "default" | "pills" | "underline" | "minimal" | "bordered";
    style?: "horizontal" | "vertical";
    dropdownTrigger?: "hover" | "click";
    dropdownAnimation?: "fade" | "slide" | "scale" | "none";
    showIcons?: boolean;
  };
}

interface MenuBlockEditorProps {
  block: MenuBlockData;
  onChange: (block: MenuBlockData) => void;
  onDelete: () => void;
}

export function MenuBlockEditor({ block, onChange }: MenuBlockEditorProps) {
  const { tenantId } = useResolvedTenant();
  const { data: menus = [] } = useMenus(tenantId || "");
  const { data } = block;

  const handleChange = (field: string, value: unknown) => {
    onChange({ ...block, data: { ...data, [field]: value } });
  };

  return (
    <div className="space-y-3">
      <div>
        <label className="text-[12px] font-semibold">Menu</label>
        <Select
          value={data.menuId || ""}
          onValueChange={(v) => handleChange("menuId", v)}
        >
          <SelectTrigger>
            <SelectValue placeholder="Choose a menu" />
          </SelectTrigger>
          <SelectContent>
            {menus.map((menu) => (
              <SelectItem key={menu.id} value={menu.id}>
                {menu.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        {menus.length === 0 && (
          <p className="text-[11px] text-(--el-500) mt-1">
            Create a menu in Menus first
          </p>
        )}
      </div>

      <div>
        <label className="text-[12px] font-semibold">Style</label>
        <Select
          value={data.style || "horizontal"}
          onValueChange={(v) => handleChange("style", v)}
        >
          <SelectTrigger>
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="horizontal">Horizontal</SelectItem>
            <SelectItem value="vertical">Vertical</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div>
        <label className="text-[12px] font-semibold">Variant</label>
        <Select
          value={data.variant || "default"}
          onValueChange={(v) => handleChange("variant", v)}
        >
          <SelectTrigger>
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="default">Default</SelectItem>
            <SelectItem value="pills">Pills</SelectItem>
            <SelectItem value="underline">Underline</SelectItem>
            <SelectItem value="minimal">Minimal</SelectItem>
            <SelectItem value="bordered">Bordered</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div>
        <label className="text-[12px] font-semibold">Dropdown trigger</label>
        <Select
          value={data.dropdownTrigger || "hover"}
          onValueChange={(v) => handleChange("dropdownTrigger", v)}
        >
          <SelectTrigger>
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="hover">Hover</SelectItem>
            <SelectItem value="click">Click</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div>
        <label className="text-[12px] font-semibold">Dropdown animation</label>
        <Select
          value={data.dropdownAnimation || "slide"}
          onValueChange={(v) => handleChange("dropdownAnimation", v)}
        >
          <SelectTrigger>
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="slide">Slide</SelectItem>
            <SelectItem value="fade">Fade</SelectItem>
            <SelectItem value="scale">Scale</SelectItem>
            <SelectItem value="none">None</SelectItem>
          </SelectContent>
        </Select>
      </div>
    </div>
  );
}
