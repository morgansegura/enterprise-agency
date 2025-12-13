"use client";

import * as React from "react";
import {
  SettingsDrawer,
  SettingsDrawerSidebar,
  SettingsDrawerNav,
  SettingsDrawerContent,
  SettingsDrawerActions,
  SettingsDrawerSaveButton,
  type SettingsNavItem,
} from "@/components/ui/settings-drawer";
import {
  useEntitySettingsState,
  isEditContext,
  isCreateContext,
  type EntityType,
} from "@/lib/settings";
import {
  FileText,
  Newspaper,
  Package,
  Receipt,
  User,
  Image,
  Settings,
  Search,
  Layout,
  Palette,
  Tag,
  DollarSign,
  Truck,
  Box,
} from "lucide-react";
import { PageSettingsPanel } from "./entity-panels/page-settings-panel";
import { PostSettingsPanel } from "./entity-panels/post-settings-panel";
import { ProductSettingsPanel } from "./entity-panels/product-settings-panel";

// =============================================================================
// Types
// =============================================================================

interface EntitySettingsDrawerProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

type TabId =
  | "general"
  | "seo"
  | "layout"
  | "style"
  | "publishing"
  | "inventory"
  | "shipping"
  | "pricing";

// =============================================================================
// Icon Map
// =============================================================================

const ENTITY_ICONS: Record<
  EntityType,
  React.ComponentType<{ className?: string }>
> = {
  page: FileText,
  post: Newspaper,
  product: Package,
  order: Receipt,
  customer: User,
  asset: Image,
  tag: Tag,
  user: User,
  client: User,
};

// =============================================================================
// Nav Items by Entity Type
// =============================================================================

const PAGE_NAV_ITEMS: SettingsNavItem<TabId>[] = [
  {
    id: "general",
    label: "General",
    icon: Settings,
    description: "Basic info",
  },
  { id: "seo", label: "SEO", icon: Search, description: "Search optimization" },
  {
    id: "layout",
    label: "Layout",
    icon: Layout,
    description: "Page structure",
  },
  { id: "style", label: "Style", icon: Palette, description: "Page styling" },
];

const POST_NAV_ITEMS: SettingsNavItem<TabId>[] = [
  {
    id: "general",
    label: "General",
    icon: Settings,
    description: "Basic info",
  },
  {
    id: "publishing",
    label: "Publishing",
    icon: Newspaper,
    description: "Status & scheduling",
  },
  { id: "seo", label: "SEO", icon: Search, description: "Search optimization" },
];

const PRODUCT_NAV_ITEMS: SettingsNavItem<TabId>[] = [
  {
    id: "general",
    label: "General",
    icon: Settings,
    description: "Basic info",
  },
  {
    id: "pricing",
    label: "Pricing",
    icon: DollarSign,
    description: "Price & costs",
  },
  {
    id: "inventory",
    label: "Inventory",
    icon: Box,
    description: "Stock tracking",
  },
  {
    id: "shipping",
    label: "Shipping",
    icon: Truck,
    description: "Weight & shipping",
  },
  { id: "seo", label: "SEO", icon: Search, description: "Search optimization" },
];

// =============================================================================
// Component
// =============================================================================

export function EntitySettingsDrawer({
  open,
  onOpenChange,
}: EntitySettingsDrawerProps) {
  const { isAvailable, context, panelConfig } = useEntitySettingsState();
  const [activeTab, setActiveTab] = React.useState<TabId>("general");
  const [hasChanges, setHasChanges] = React.useState(false);
  const [isSaving, setIsSaving] = React.useState(false);

  // Entity data state - in a real app, this would come from a query
  const [entityData, setEntityData] = React.useState<Record<string, unknown>>(
    {},
  );

  // Reset tab when entity changes
  React.useEffect(() => {
    setActiveTab("general");
    setHasChanges(false);
  }, [context?.mode, panelConfig?.entityType]);

  // Handle field changes
  const handleChange = (field: string, value: unknown) => {
    setEntityData((prev) => ({ ...prev, [field]: value }));
    setHasChanges(true);
  };

  // Handle save
  const handleSave = async () => {
    setIsSaving(true);
    try {
      // TODO: Implement actual save logic based on entity type
      await new Promise((resolve) => setTimeout(resolve, 500));
      setHasChanges(false);
    } finally {
      setIsSaving(false);
    }
  };

  // Get nav items based on entity type
  const getNavItems = (): SettingsNavItem<TabId>[] => {
    if (!panelConfig) return PAGE_NAV_ITEMS;

    switch (panelConfig.entityType) {
      case "page":
        return PAGE_NAV_ITEMS;
      case "post":
        return POST_NAV_ITEMS;
      case "product":
        return PRODUCT_NAV_ITEMS;
      default:
        return PAGE_NAV_ITEMS;
    }
  };

  // Get title
  const getTitle = () => {
    if (!panelConfig) return "Settings";
    return panelConfig.title;
  };

  // Get icon
  const getIcon = () => {
    if (!panelConfig) return Settings;
    return ENTITY_ICONS[panelConfig.entityType] || Settings;
  };

  // Render not available state
  if (!isAvailable || !context) {
    return (
      <SettingsDrawer open={open} onOpenChange={onOpenChange} title="Settings">
        <SettingsDrawerSidebar
          title="Settings"
          titleIcon={<Settings className="size-4" />}
        >
          <div className="p-4 text-sm text-muted-foreground">
            <p>No settings available for this view.</p>
            <p className="mt-2">
              Navigate to a page, post, or product editor to access settings.
            </p>
          </div>
        </SettingsDrawerSidebar>
        <SettingsDrawerContent>
          <div className="flex items-center justify-center h-full text-muted-foreground">
            <div className="text-center">
              <Settings className="size-12 mx-auto mb-4 opacity-50" />
              <p>Select an item to edit to view its settings</p>
            </div>
          </div>
        </SettingsDrawerContent>
      </SettingsDrawer>
    );
  }

  const Icon = getIcon();
  const navItems = getNavItems();

  return (
    <SettingsDrawer open={open} onOpenChange={onOpenChange} title={getTitle()}>
      <SettingsDrawerSidebar
        title={getTitle()}
        description={
          isEditContext(context)
            ? `Editing ${panelConfig?.entityType}`
            : `Creating new ${panelConfig?.entityType}`
        }
        titleIcon={<Icon className="size-4" />}
      >
        <SettingsDrawerNav<TabId>
          items={navItems}
          activeTab={activeTab}
          onTabChange={setActiveTab}
        />
      </SettingsDrawerSidebar>

      <SettingsDrawerContent>
        <SettingsDrawerActions>
          <SettingsDrawerSaveButton
            onClick={handleSave}
            isPending={isSaving}
            hasChanges={hasChanges}
          />
        </SettingsDrawerActions>

        {/* Render appropriate panel based on entity type */}
        {panelConfig?.entityType === "page" &&
          (isEditContext(context) || isCreateContext(context)) && (
            <PageSettingsPanel
              context={context}
              data={entityData}
              onChange={handleChange}
            />
          )}

        {panelConfig?.entityType === "post" &&
          (isEditContext(context) || isCreateContext(context)) && (
            <PostSettingsPanel
              context={context}
              data={entityData}
              onChange={handleChange}
            />
          )}

        {panelConfig?.entityType === "product" &&
          (isEditContext(context) || isCreateContext(context)) && (
            <ProductSettingsPanel
              context={context}
              data={entityData}
              onChange={handleChange}
            />
          )}
      </SettingsDrawerContent>
    </SettingsDrawer>
  );
}
