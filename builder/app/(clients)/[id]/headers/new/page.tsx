"use client";

import * as React from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { useCreateHeader, type HeaderBehavior } from "@/lib/hooks/use-headers";
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
import { Minus, Pin, PinOff, EyeOff, Layers } from "lucide-react";
import { useToast } from "@/components/ui/toast";

const headerSchema = z.object({
  name: z.string().min(1, "Name is required"),
  slug: z.string().min(1, "Slug is required"),
  behavior: z.enum(["STATIC", "FIXED", "STICKY", "SCROLL_HIDE", "TRANSPARENT"]),
  isDefault: z.boolean().optional(),
});

type HeaderForm = z.infer<typeof headerSchema>;

const behaviorOptions: {
  value: HeaderBehavior;
  label: string;
  description: string;
  icon: React.ReactNode;
}[] = [
  {
    value: "STATIC",
    label: "Static",
    description: "Normal flow, scrolls with page",
    icon: <Minus className="header-behavior-icon" />,
  },
  {
    value: "FIXED",
    label: "Fixed",
    description: "Always visible at top",
    icon: <Pin className="header-behavior-icon" />,
  },
  {
    value: "STICKY",
    label: "Sticky",
    description: "Sticks to top when scrolling past",
    icon: <PinOff className="header-behavior-icon" />,
  },
  {
    value: "SCROLL_HIDE",
    label: "Scroll Hide",
    description: "Hides on scroll down, shows on scroll up",
    icon: <EyeOff className="header-behavior-icon" />,
  },
  {
    value: "TRANSPARENT",
    label: "Transparent",
    description: "Transparent at top, solid on scroll",
    icon: <Layers className="header-behavior-icon" />,
  },
];

export default function NewHeaderPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const resolvedParams = React.use(params);
  const { id } = resolvedParams;
  const router = useRouter();
  const createHeader = useCreateHeader(id);
  const { toast } = useToast();

  const form = useForm<HeaderForm>({
    resolver: zodResolver(headerSchema),
    defaultValues: {
      name: "",
      slug: "",
      behavior: "STATIC",
      isDefault: false,
    },
  });

  const onSubmit = (data: HeaderForm) => {
    console.log("[NewHeader] Submitting:", data);

    createHeader.mutate(
      {
        name: data.name,
        slug: data.slug,
        behavior: data.behavior,
        isDefault: data.isDefault,
        zones: {},
        style: {},
      },
      {
        onSuccess: (header) => {
          console.log("[NewHeader] Created successfully:", header);
          toast.success(
            "Header created",
            `"${data.name}" has been created successfully.`,
          );
          router.push(`/${id}/headers/${header.id}/edit`);
        },
        onError: (err) => {
          console.error("[NewHeader] Creation failed:", err);
          const message =
            err instanceof Error ? err.message : "Failed to create header";
          toast.error("Failed to create header", message);
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
      title="New Header"
      description="Create a new header for your site"
      onBack={() => router.push(`/${id}/headers`)}
      maxWidth="lg"
    >
      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(onSubmit)}
          className="new-header-form"
        >
          <Card>
            <CardHeader>
              <CardTitle>Header Details</CardTitle>
            </CardHeader>
            <CardContent className="new-header-form-content">
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Name</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="Main Header"
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
                      <Input placeholder="main-header" {...field} />
                    </FormControl>
                    <FormDescription>
                      Unique identifier for this header
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="behavior"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Behavior</FormLabel>
                    <Select
                      onValueChange={field.onChange}
                      defaultValue={field.value}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select behavior" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {behaviorOptions.map((option) => (
                          <SelectItem key={option.value} value={option.value}>
                            <div className="header-behavior-option">
                              {option.icon}
                              <div className="header-behavior-option-text">
                                <span className="header-behavior-option-label">
                                  {option.label}
                                </span>
                                <span className="header-behavior-option-description">
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
                  <FormItem className="new-header-default-field">
                    <div className="new-header-default-field-content">
                      <FormLabel>Set as Default</FormLabel>
                      <FormDescription>
                        Use this header as the default for new pages
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

          <div className="new-header-actions">
            <Button
              type="button"
              variant="outline"
              onClick={() => router.push(`/${id}/headers`)}
            >
              Cancel
            </Button>
            <Button type="submit" disabled={createHeader.isPending}>
              {createHeader.isPending ? "Creating..." : "Create Header"}
            </Button>
          </div>
        </form>
      </Form>
    </PageLayout>
  );
}
