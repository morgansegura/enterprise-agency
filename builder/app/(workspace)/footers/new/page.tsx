"use client";

import * as React from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { useCreateFooter, type FooterLayout } from "@/lib/hooks/use-footers";
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
import { Minus, Columns3, Layers, AlignCenter, LayoutList } from "lucide-react";
import { useToast } from "@/components/ui/toast";
import { useResolvedTenant } from "@/lib/hooks/use-resolved-tenant";

import "./new-footer.css";

const footerSchema = z.object({
  name: z.string().min(1, "Name is required"),
  slug: z.string().min(1, "Slug is required"),
  layout: z.enum(["SIMPLE", "COLUMNS", "STACKED", "MINIMAL", "CENTERED"]),
  isDefault: z.boolean().optional(),
});

type FooterForm = z.infer<typeof footerSchema>;

const layoutOptions: {
  value: FooterLayout;
  label: string;
  description: string;
  icon: React.ReactNode;
}[] = [
  {
    value: "SIMPLE",
    label: "Simple",
    description: "Single zone footer",
    icon: <Minus className="footer-layout-icon" />,
  },
  {
    value: "COLUMNS",
    label: "Columns",
    description: "2-4 column grid layout",
    icon: <Columns3 className="footer-layout-icon" />,
  },
  {
    value: "STACKED",
    label: "Stacked",
    description: "Vertically stacked sections",
    icon: <LayoutList className="footer-layout-icon" />,
  },
  {
    value: "MINIMAL",
    label: "Minimal",
    description: "Compact single-line footer",
    icon: <Layers className="footer-layout-icon" />,
  },
  {
    value: "CENTERED",
    label: "Centered",
    description: "Center-aligned content",
    icon: <AlignCenter className="footer-layout-icon" />,
  },
];

export default function NewFooterPage() {
  const { tenantId } = useResolvedTenant();
  const id = tenantId!;
  const router = useRouter();
  const createFooter = useCreateFooter(id);
  const { toast } = useToast();

  const form = useForm<FooterForm>({
    resolver: zodResolver(footerSchema),
    defaultValues: {
      name: "",
      slug: "",
      layout: "SIMPLE",
      isDefault: false,
    },
  });

  const onSubmit = (data: FooterForm) => {
    createFooter.mutate(
      {
        name: data.name,
        slug: data.slug,
        layout: data.layout,
        isDefault: data.isDefault,
        zones: {},
        style: {},
      },
      {
        onSuccess: (footer) => {
          toast.success(
            "Footer created",
            `"${data.name}" has been created successfully.`,
          );
          router.push(`/footers/${footer.id}/edit`);
        },
        onError: (err) => {
          const message =
            err instanceof Error ? err.message : "Failed to create footer";
          toast.error("Failed to create footer", message);
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
      title="New Footer"
      description="Create a new footer for your site"
      onBack={() => router.push("/footers")}
      maxWidth="lg"
    >
      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(onSubmit)}
          className="new-footer-form"
        >
          <Card>
            <CardHeader>
              <CardTitle>Footer Details</CardTitle>
            </CardHeader>
            <CardContent className="new-footer-form-content">
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Name</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="Main Footer"
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
                      <Input placeholder="main-footer" {...field} />
                    </FormControl>
                    <FormDescription>
                      Unique identifier for this footer
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="layout"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Layout</FormLabel>
                    <Select
                      onValueChange={field.onChange}
                      defaultValue={field.value}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select layout" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {layoutOptions.map((option) => (
                          <SelectItem key={option.value} value={option.value}>
                            <div className="footer-layout-option">
                              {option.icon}
                              <div className="footer-layout-option-text">
                                <span className="footer-layout-option-label">
                                  {option.label}
                                </span>
                                <span className="footer-layout-option-description">
                                  {option.description}
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
                  <FormItem className="new-footer-default-field">
                    <div className="new-footer-default-field-content">
                      <FormLabel>Set as Default</FormLabel>
                      <FormDescription>
                        Use this footer as the default for new pages
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

          <div className="new-footer-actions">
            <Button
              type="button"
              variant="outline"
              onClick={() => router.push("/footers")}
            >
              Cancel
            </Button>
            <Button type="submit" disabled={createFooter.isPending}>
              {createFooter.isPending ? "Creating..." : "Create Footer"}
            </Button>
          </div>
        </form>
      </Form>
    </PageLayout>
  );
}
