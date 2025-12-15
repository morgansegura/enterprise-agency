"use client";

import * as React from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import {
  useMenu,
  useUpdateMenu,
  type MenuItem,
  type MenuStyle,
  type MenuType,
} from "@/lib/hooks/use-menus";
import { PageLayout } from "@/components/layout/page-layout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { MenuItemTree, MenuStylePanel, MenuPreview } from "@/components/menus";
import {
  Save,
  Menu as MenuIcon,
  Rows3,
  Grid3X3,
  ChevronDown,
  Loader2,
} from "lucide-react";
import { toast } from "sonner";

import "./page.css";

const menuSchema = z.object({
  name: z.string().min(1, "Name is required"),
  slug: z.string().min(1, "Slug is required"),
  type: z.enum(["horizontal", "vertical", "dropdown", "mega"]),
  isDefault: z.boolean().optional(),
});

type MenuForm = z.infer<typeof menuSchema>;

const menuTypes: { value: MenuType; label: string; icon: React.ReactNode }[] = [
  { value: "horizontal", label: "Horizontal", icon: <MenuIcon /> },
  { value: "vertical", label: "Vertical", icon: <Rows3 /> },
  { value: "dropdown", label: "Dropdown", icon: <ChevronDown /> },
  { value: "mega", label: "Mega Menu", icon: <Grid3X3 /> },
];

export default function MenuEditorPage({
  params,
}: {
  params: Promise<{ id: string; menuId: string }>;
}) {
  const resolvedParams = React.use(params);
  const { id, menuId } = resolvedParams;
  const router = useRouter();
  const { data: menu, isLoading, error } = useMenu(id, menuId);
  const updateMenu = useUpdateMenu(id);

  const [items, setItems] = React.useState<MenuItem[]>([]);
  const [style, setStyle] = React.useState<MenuStyle>({});
  const [hasChanges, setHasChanges] = React.useState(false);

  const form = useForm<MenuForm>({
    resolver: zodResolver(menuSchema),
    defaultValues: {
      name: "",
      slug: "",
      type: "horizontal",
      isDefault: false,
    },
  });

  // Initialize form with menu data
  React.useEffect(() => {
    if (menu) {
      form.reset({
        name: menu.name,
        slug: menu.slug,
        type: menu.type,
        isDefault: menu.isDefault,
      });
      setItems(menu.items || []);
      setStyle(menu.style || {});
    }
  }, [menu, form]);

  // Track changes
  React.useEffect(() => {
    if (menu) {
      const formValues = form.getValues();
      const formChanged =
        formValues.name !== menu.name ||
        formValues.slug !== menu.slug ||
        formValues.type !== menu.type ||
        formValues.isDefault !== menu.isDefault;

      const itemsChanged =
        JSON.stringify(items) !== JSON.stringify(menu.items || []);
      const styleChanged =
        JSON.stringify(style) !== JSON.stringify(menu.style || {});

      setHasChanges(formChanged || itemsChanged || styleChanged);
    }
  }, [form, items, style, menu]);

  const handleSave = async () => {
    const formValues = form.getValues();
    const isValid = await form.trigger();

    if (!isValid) {
      toast.error("Please fix form errors before saving");
      return;
    }

    updateMenu.mutate(
      {
        id: menuId,
        data: {
          name: formValues.name,
          slug: formValues.slug,
          type: formValues.type,
          isDefault: formValues.isDefault,
          items,
          style,
        },
      },
      {
        onSuccess: () => {
          toast.success("Menu saved successfully");
          setHasChanges(false);
        },
        onError: (error) => {
          toast.error(error.message || "Failed to save menu");
        },
      },
    );
  };

  if (isLoading) {
    return (
      <div className="menu-editor-loading">
        <Loader2 className="menu-editor-loading-icon" />
        <p>Loading menu...</p>
      </div>
    );
  }

  if (error || !menu) {
    return (
      <div className="menu-editor-error">
        <p>Failed to load menu</p>
        <Button variant="outline" onClick={() => router.push(`/${id}/menus`)}>
          Back to Menus
        </Button>
      </div>
    );
  }

  return (
    <PageLayout
      title={`Edit: ${menu.name}`}
      description="Configure menu items and styling"
      onBack={() => router.push(`/${id}/menus`)}
      actions={
        <Button
          onClick={handleSave}
          disabled={!hasChanges || updateMenu.isPending}
        >
          {updateMenu.isPending ? (
            <>
              <Loader2 className="animate-spin size-4" />
              Saving...
            </>
          ) : (
            <>
              <Save />
              Save Changes
            </>
          )}
        </Button>
      }
    >
      <div className="menu-editor-content">
        <div className="menu-editor-main">
          <Tabs defaultValue="items">
            <TabsList>
              <TabsTrigger value="items">Items</TabsTrigger>
              <TabsTrigger value="style">Style</TabsTrigger>
              <TabsTrigger value="settings">Settings</TabsTrigger>
            </TabsList>

            <TabsContent value="items">
              <Card>
                <CardContent className="menu-editor-items-content">
                  <MenuItemTree
                    items={items}
                    onChange={setItems}
                    maxDepth={form.watch("type") === "mega" ? 2 : 3}
                  />
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="style">
              <Card>
                <CardContent className="menu-editor-style-content">
                  <MenuStylePanel style={style} onChange={setStyle} />
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="settings">
              <Card>
                <CardHeader>
                  <CardTitle>Menu Settings</CardTitle>
                </CardHeader>
                <CardContent>
                  <Form {...form}>
                    <div className="menu-editor-settings">
                      <FormField
                        control={form.control}
                        name="name"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Name</FormLabel>
                            <FormControl>
                              <Input {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={form.control}
                        name="slug"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Slug</FormLabel>
                            <FormControl>
                              <Input {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={form.control}
                        name="type"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Menu Type</FormLabel>
                            <Select
                              onValueChange={field.onChange}
                              value={field.value}
                            >
                              <FormControl>
                                <SelectTrigger>
                                  <SelectValue />
                                </SelectTrigger>
                              </FormControl>
                              <SelectContent>
                                {menuTypes.map((type) => (
                                  <SelectItem
                                    key={type.value}
                                    value={type.value}
                                  >
                                    <span className="menu-editor-type-option">
                                      {type.icon}
                                      {type.label}
                                    </span>
                                  </SelectItem>
                                ))}
                              </SelectContent>
                            </Select>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={form.control}
                        name="isDefault"
                        render={({ field }) => (
                          <FormItem className="menu-editor-default-field">
                            <div className="menu-editor-default-content">
                              <FormLabel>Default Menu</FormLabel>
                              <p className="menu-editor-default-description">
                                Use as default menu for new pages
                              </p>
                            </div>
                            <FormControl>
                              <Switch
                                checked={field.value}
                                onCheckedChange={field.onChange}
                              />
                            </FormControl>
                          </FormItem>
                        )}
                      />
                    </div>
                  </Form>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>

        <div className="menu-editor-sidebar">
          <Card>
            <CardContent className="menu-editor-preview-content">
              <MenuPreview
                items={items}
                type={form.watch("type")}
                style={style}
              />
            </CardContent>
          </Card>
        </div>
      </div>
    </PageLayout>
  );
}
