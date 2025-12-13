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
import { useGlobalSettingsState, type SettingsSection } from "@/lib/settings";
import {
  Globe,
  Newspaper,
  Store,
  Image,
  Shield,
  Calendar,
  Settings,
  Palette,
  CreditCard,
  Truck,
  MessageSquare,
  Rss,
  Search,
  Mail,
} from "lucide-react";
import { ShopGlobalSettings } from "./global-panels/shop-global-settings";
import { BlogGlobalSettings } from "./global-panels/blog-global-settings";
import { WebsiteGlobalSettings } from "./global-panels/website-global-settings";

// =============================================================================
// Types
// =============================================================================

interface GlobalSettingsDrawerProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

type ShopTabId =
  | "store"
  | "checkout"
  | "payments"
  | "shipping"
  | "tax"
  | "inventory";
type BlogTabId = "general" | "display" | "comments" | "rss" | "social";
type WebsiteTabId =
  | "general"
  | "branding"
  | "seo"
  | "social"
  | "technical"
  | "contact";
type TabId = ShopTabId | BlogTabId | WebsiteTabId | "general";

// =============================================================================
// Section Icon Map
// =============================================================================

const SECTION_ICONS: Record<
  SettingsSection,
  React.ComponentType<{ className?: string }>
> = {
  website: Globe,
  blog: Newspaper,
  shop: Store,
  media: Image,
  admin: Shield,
  bookings: Calendar,
};

// =============================================================================
// Nav Items by Section
// =============================================================================

const SHOP_NAV_ITEMS: SettingsNavItem<ShopTabId>[] = [
  { id: "store", label: "Store", icon: Store, description: "Store info" },
  {
    id: "checkout",
    label: "Checkout",
    icon: CreditCard,
    description: "Checkout options",
  },
  {
    id: "payments",
    label: "Payments",
    icon: CreditCard,
    description: "Payment providers",
  },
  {
    id: "shipping",
    label: "Shipping",
    icon: Truck,
    description: "Shipping rules",
  },
  { id: "tax", label: "Tax", icon: CreditCard, description: "Tax settings" },
  {
    id: "inventory",
    label: "Inventory",
    icon: Store,
    description: "Stock settings",
  },
];

const BLOG_NAV_ITEMS: SettingsNavItem<BlogTabId>[] = [
  {
    id: "general",
    label: "General",
    icon: Settings,
    description: "Basic config",
  },
  {
    id: "display",
    label: "Display",
    icon: Palette,
    description: "Layout options",
  },
  {
    id: "comments",
    label: "Comments",
    icon: MessageSquare,
    description: "Commenting",
  },
  { id: "rss", label: "RSS", icon: Rss, description: "Feed settings" },
  {
    id: "social",
    label: "Social",
    icon: Globe,
    description: "Sharing options",
  },
];

const WEBSITE_NAV_ITEMS: SettingsNavItem<WebsiteTabId>[] = [
  { id: "general", label: "General", icon: Settings, description: "Site info" },
  {
    id: "branding",
    label: "Branding",
    icon: Palette,
    description: "Colors & logo",
  },
  { id: "seo", label: "SEO", icon: Search, description: "Meta & analytics" },
  { id: "social", label: "Social", icon: Globe, description: "Social links" },
  {
    id: "technical",
    label: "Technical",
    icon: Settings,
    description: "Indexing & sitemap",
  },
  { id: "contact", label: "Contact", icon: Mail, description: "Business info" },
];

const DEFAULT_NAV_ITEMS: SettingsNavItem<"general">[] = [
  { id: "general", label: "General", icon: Settings, description: "Settings" },
];

// =============================================================================
// Component
// =============================================================================

export function GlobalSettingsDrawer({
  open,
  onOpenChange,
}: GlobalSettingsDrawerProps) {
  const { section, panelConfig } = useGlobalSettingsState();
  const [activeTab, setActiveTab] = React.useState<TabId>("general");
  const [hasChanges, setHasChanges] = React.useState(false);
  const [isSaving, setIsSaving] = React.useState(false);

  // Settings data state - in a real app, this would come from a query
  const [settingsData, setSettingsData] = React.useState<
    Record<string, unknown>
  >({});

  // Reset tab when section changes
  React.useEffect(() => {
    setActiveTab("general");
    setHasChanges(false);
  }, [section]);

  // Handle field changes
  const handleChange = (field: string, value: unknown) => {
    setSettingsData((prev) => ({ ...prev, [field]: value }));
    setHasChanges(true);
  };

  // Handle save
  const handleSave = async () => {
    setIsSaving(true);
    try {
      // TODO: Implement actual save logic based on section
      await new Promise((resolve) => setTimeout(resolve, 500));
      setHasChanges(false);
    } finally {
      setIsSaving(false);
    }
  };

  // Get nav items based on section
  const getNavItems = (): SettingsNavItem<TabId>[] => {
    switch (section) {
      case "shop":
        return SHOP_NAV_ITEMS;
      case "blog":
        return BLOG_NAV_ITEMS;
      case "website":
        return WEBSITE_NAV_ITEMS;
      default:
        return DEFAULT_NAV_ITEMS;
    }
  };

  // Get title based on section
  const getTitle = () => {
    return panelConfig?.title || "Settings";
  };

  // Get description based on section
  const getDescription = () => {
    return panelConfig?.description || "Configure settings for this section";
  };

  // Get icon based on section
  const getIcon = () => {
    return SECTION_ICONS[section] || Settings;
  };

  const Icon = getIcon();
  const navItems = getNavItems();

  return (
    <SettingsDrawer open={open} onOpenChange={onOpenChange} title={getTitle()}>
      <SettingsDrawerSidebar
        title={getTitle()}
        description={getDescription()}
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

        {/* Render appropriate panel based on section */}
        {section === "shop" && (
          <ShopGlobalSettings
            data={settingsData}
            onChange={handleChange}
            isLoading={isSaving}
          />
        )}

        {section === "blog" && (
          <BlogGlobalSettings
            data={settingsData}
            onChange={handleChange}
            isLoading={isSaving}
          />
        )}

        {section === "website" && (
          <WebsiteGlobalSettings
            data={settingsData}
            onChange={handleChange}
            isLoading={isSaving}
          />
        )}

        {section === "media" && (
          <div className="p-6">
            <p className="text-sm text-muted-foreground">
              Media settings coming soon. Configure storage, upload limits, and
              image processing options.
            </p>
          </div>
        )}

        {section === "admin" && (
          <div className="p-6">
            <p className="text-sm text-muted-foreground">
              Admin settings coming soon. Configure user roles, permissions, and
              access control.
            </p>
          </div>
        )}

        {section === "bookings" && (
          <div className="p-6">
            <p className="text-sm text-muted-foreground">
              Bookings settings coming soon. Configure availability, pricing
              tiers, and booking rules.
            </p>
          </div>
        )}
      </SettingsDrawerContent>
    </SettingsDrawer>
  );
}
