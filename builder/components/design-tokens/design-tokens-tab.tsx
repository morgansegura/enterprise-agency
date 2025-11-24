"use client";

import * as React from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { useTenantTokens, useUpdateTenantTokens, TenantTokens } from "@/lib/hooks";
import { Form } from "@/components/ui/form";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Loader2 } from "lucide-react";
import { HeaderTokenEditor } from "./header-token-editor";
import { MenuTokenEditor } from "./menu-token-editor";
import { SectionTokenEditor } from "./section-token-editor";

// Simplified schema - all fields are optional overrides
const tokenSchema = z.object({
  header: z.any().optional(),
  menu: z.any().optional(),
  footer: z.any().optional(),
  section: z.any().optional(),
});

interface DesignTokensTabProps {
  tenantId: string;
}

export function DesignTokensTab({ tenantId }: DesignTokensTabProps) {
  const { data: tokens, isLoading } = useTenantTokens(tenantId);
  const updateTokens = useUpdateTenantTokens();

  const form = useForm<TenantTokens>({
    resolver: zodResolver(tokenSchema),
    values: tokens || {},
  });

  const onSubmit = (data: TenantTokens) => {
    updateTokens.mutate(
      { tenantId, tokens: data },
      {
        onSuccess: () => {
          // Success handled by mutation hook
        },
      },
    );
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-8">
        <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
      </div>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Design Tokens</CardTitle>
        <CardDescription>
          Customize the visual appearance of this client's website. These values
          override the platform defaults.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <Accordion type="single" collapsible className="w-full">
              <AccordionItem value="header">
                <AccordionTrigger className="text-sm font-medium">
                  Header Tokens
                </AccordionTrigger>
                <AccordionContent className="pt-4">
                  <HeaderTokenEditor form={form} />
                </AccordionContent>
              </AccordionItem>

              <AccordionItem value="menu">
                <AccordionTrigger className="text-sm font-medium">
                  Menu Tokens
                </AccordionTrigger>
                <AccordionContent className="pt-4">
                  <MenuTokenEditor form={form} />
                </AccordionContent>
              </AccordionItem>

              <AccordionItem value="section">
                <AccordionTrigger className="text-sm font-medium">
                  Section Tokens
                </AccordionTrigger>
                <AccordionContent className="pt-4">
                  <SectionTokenEditor form={form} />
                </AccordionContent>
              </AccordionItem>

              <AccordionItem value="footer">
                <AccordionTrigger className="text-sm font-medium">
                  Footer Tokens
                </AccordionTrigger>
                <AccordionContent className="pt-4">
                  <div className="text-sm text-muted-foreground">
                    Footer token customization coming soon
                  </div>
                </AccordionContent>
              </AccordionItem>
            </Accordion>

            <div className="flex items-center justify-between pt-4 border-t">
              <Button
                type="button"
                variant="outline"
                onClick={() => form.reset()}
                disabled={updateTokens.isPending}
              >
                Reset
              </Button>
              <Button type="submit" disabled={updateTokens.isPending}>
                {updateTokens.isPending ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Saving...
                  </>
                ) : (
                  "Save Changes"
                )}
              </Button>
            </div>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
}
