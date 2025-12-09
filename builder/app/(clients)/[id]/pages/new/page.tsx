"use client";

import * as React from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { useCreatePage } from "@/lib/hooks/use-pages";
import { LayoutHeading } from "@/components/layout/layout-heading";
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
import { ArrowLeft } from "lucide-react";

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

  const onSubmit = (data: PageForm) => {
    createPage.mutate(
      {
        title: data.title,
        slug: data.slug,
        template: data.template,
        status: "draft",
        sections: [],
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
    <div>
      <LayoutHeading
        title="New Page"
        description="Create a new page for your site"
        back={
          <Button
            variant="outline"
            size="sm"
            onClick={() => router.push(`/${id}/pages`)}
          >
            <ArrowLeft />
          </Button>
        }
      />

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
                      <Input {...field} placeholder="default" />
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
    </div>
  );
}
