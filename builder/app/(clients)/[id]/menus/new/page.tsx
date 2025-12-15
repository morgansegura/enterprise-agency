"use client";

import * as React from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { useCreateMenu, type MenuType } from "@/lib/hooks/use-menus";
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
  FormDescription,
} from "@/components/ui/form";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { Menu, Rows3, Grid3X3, ChevronDown } from "lucide-react";

const menuSchema = z.object({
  name: z.string().min(1, "Name is required"),
  slug: z.string().min(1, "Slug is required"),
  type: z.enum(["horizontal", "vertical", "dropdown", "mega"]),
  isDefault: z.boolean().optional(),
});

type MenuForm = z.infer<typeof menuSchema>;

const menuTypes: {
  value: MenuType;
  label: string;
  description: string;
  icon: React.ReactNode;
}[] = [
  {
    value: "horizontal",
    label: "Horizontal",
    description: "Standard horizontal navigation bar",
    icon: <Menu className="menu-type-icon" />,
  },
  {
    value: "vertical",
    label: "Vertical",
    description: "Sidebar or stacked menu layout",
    icon: <Rows3 className="menu-type-icon" />,
  },
  {
    value: "dropdown",
    label: "Dropdown",
    description: "Menu with dropdown submenus",
    icon: <ChevronDown className="menu-type-icon" />,
  },
  {
    value: "mega",
    label: "Mega Menu",
    description: "Large dropdown with multiple columns",
    icon: <Grid3X3 className="menu-type-icon" />,
  },
];

export default function NewMenuPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const resolvedParams = React.use(params);
  const { id } = resolvedParams;
  const router = useRouter();
  const createMenu = useCreateMenu(id);

  const form = useForm<MenuForm>({
    resolver: zodResolver(menuSchema),
    defaultValues: {
      name: "",
      slug: "",
      type: "horizontal",
      isDefault: false,
    },
  });

  const onSubmit = (data: MenuForm) => {
    createMenu.mutate(
      {
        name: data.name,
        slug: data.slug,
        type: data.type,
        isDefault: data.isDefault,
        items: [],
        style: {},
      },
      {
        onSuccess: (menu) => {
          router.push(`/${id}/menus/${menu.id}/edit`);
        },
      },
    );
  };

  const handleNameChange = (value: string) => {
    const slug = value
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/^-|-$/g, "");
    form.setValue("slug", slug);
  };

  return (
    <PageLayout
      title="New Menu"
      description="Create a new navigation menu"
      onBack={() => router.push(`/${id}/menus`)}
      maxWidth="lg"
    >
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="new-menu-form">
          <Card>
            <CardHeader>
              <CardTitle>Menu Details</CardTitle>
            </CardHeader>
            <CardContent className="new-menu-form-content">
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Name</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="Main Navigation"
                        {...field}
                        onChange={(e) => {
                          field.onChange(e);
                          handleNameChange(e.target.value);
                        }}
                      />
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
                      <Input placeholder="main-navigation" {...field} />
                    </FormControl>
                    <FormDescription>
                      Unique identifier for this menu
                    </FormDescription>
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
                      defaultValue={field.value}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select menu type" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {menuTypes.map((type) => (
                          <SelectItem key={type.value} value={type.value}>
                            <div className="menu-type-option">
                              {type.icon}
                              <div className="menu-type-option-text">
                                <span className="menu-type-option-label">
                                  {type.label}
                                </span>
                                <span className="menu-type-option-description">
                                  {type.description}
                                </span>
                              </div>
                            </div>
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
                  <FormItem className="new-menu-default-field">
                    <div className="new-menu-default-field-content">
                      <FormLabel>Set as Default</FormLabel>
                      <FormDescription>
                        Use this menu as the default for new pages
                      </FormDescription>
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
            </CardContent>
          </Card>

          <div className="new-menu-actions">
            <Button
              type="button"
              variant="outline"
              onClick={() => router.push(`/${id}/menus`)}
            >
              Cancel
            </Button>
            <Button type="submit" disabled={createMenu.isPending}>
              {createMenu.isPending ? "Creating..." : "Create Menu"}
            </Button>
          </div>
        </form>
      </Form>
    </PageLayout>
  );
}
