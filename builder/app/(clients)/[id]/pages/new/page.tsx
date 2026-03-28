"use client";

import * as React from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { useCreatePage } from "@/lib/hooks/use-pages";
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

const pageSchema = z.object({
  title: z.string().min(1, "Title is required"),
  slug: z.string().min(1, "Slug is required"),
  template: z.string().optional(),
});

type PageForm = z.infer<typeof pageSchema>;

export default function NewPagePage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const resolvedParams = React.use(params);
  const { id } = resolvedParams;
  const router = useRouter();
  const createPage = useCreatePage(id);

  const form = useForm<PageForm>({
    resolver: zodResolver(pageSchema),
    defaultValues: {
      title: "",
      slug: "",
      template: "default",
    },
  });

  // Generate starter sections based on template
  const getStarterSections = (template: string, title?: string) => {
    const ts = Date.now();
    if (template === "blank") return [];
    // Default template: hero section + content section
    return [
      {
        _type: "section" as const,
        _key: `section-hero-${ts}`,
        width: "full",
        paddingY: "xl",
        containers: [{
          _type: "container" as const,
          _key: `container-hero-${ts}`,
          blocks: [
            { _key: `heading-${ts}`, _type: "heading-block", data: { text: title || "Page Title", level: "h1", size: "4xl", align: "center", weight: "bold" } },
            { _key: `text-${ts}`, _type: "text-block", data: { text: "Welcome to your new page. Click on any text to edit it directly.", size: "lg", align: "center", variant: "muted" } },
          ],
        }],
      },
      {
        _type: "section" as const,
        _key: `section-content-${ts + 1}`,
        width: "container",
        paddingY: "lg",
        containers: [{
          _type: "container" as const,
          _key: `container-content-${ts + 1}`,
          blocks: [
            { _key: `richtext-${ts + 1}`, _type: "rich-text-block", data: { html: "<p>Start adding your content here. Use the <strong>Add</strong> panel on the left to insert new blocks.</p>", size: "md", align: "left" } },
          ],
        }],
      },
    ];
  };

  const onSubmit = (formData: PageForm) => {
    createPage.mutate(
      {
        title: formData.title,
        slug: formData.slug,
        template: formData.template,
        status: "draft",
        sections: getStarterSections(formData.template || "default", formData.title) as unknown as import("@/lib/hooks/use-pages").Section[],
      },
      {
        onSuccess: (page) => {
          router.push(`/${id}/pages/${page.id}/edit`);
        },
      },
    );
  };

  // Auto-generate slug from title
  const handleTitleChange = (value: string) => {
    const slug = value
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/^-|-$/g, "");
    form.setValue("slug", slug);
  };

  return (
    <PageLayout
      title="New Page"
      description="Create a new page for your site"
      backHref={`/${id}/pages`}
      maxWidth="md"
    >

      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Page Details</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <FormField
                control={form.control}
                name="title"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Title</FormLabel>
                    <FormControl>
                      <Input
                        {...field}
                        onChange={(e) => {
                          field.onChange(e);
                          handleTitleChange(e.target.value);
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
                    <FormLabel>Slug (URL)</FormLabel>
                    <FormControl>
                      <Input {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="template"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Template</FormLabel>
                    <FormControl>
                      <select
                        {...field}
                        className="w-full h-8 px-2.5 text-[14px] rounded-[3px] bg-[var(--el-0)] border border-[var(--border-default)] text-[var(--el-800)]"
                      >
                        <option value="default">Default (Hero + Content)</option>
                        <option value="blank">Blank Page</option>
                      </select>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </CardContent>
          </Card>

          <Button type="submit" disabled={createPage.isPending}>
            {createPage.isPending ? "Creating..." : "Create Page"}
          </Button>
        </form>
      </Form>
    </PageLayout>
  );
}
