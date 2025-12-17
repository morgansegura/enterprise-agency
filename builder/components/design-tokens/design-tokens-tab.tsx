"use client";

import * as React from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Palette, ArrowRight } from "lucide-react";

interface DesignTokensTabProps {
  tenantId: string;
}

export function DesignTokensTab({ tenantId }: DesignTokensTabProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Design Tokens</CardTitle>
        <CardDescription>
          Customize your site&apos;s complete design system with colors,
          typography, spacing, and more.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="flex items-start gap-4 p-6 bg-muted/50 rounded-lg border">
          <div className="rounded-full bg-primary/10 p-3">
            <Palette className="h-6 w-6 text-primary" />
          </div>
          <div className="flex-1 space-y-2">
            <h3 className="font-semibold">Use the Theme Manager</h3>
            <p className="text-sm text-muted-foreground">
              The new Theme Manager provides a comprehensive interface for
              customizing all design tokens including color scales, typography
              settings, spacing values, and more. Generate live CSS previews and
              see changes in real-time.
            </p>
            <Link href={`/${tenantId}/theme`}>
              <Button className="mt-3">
                Open Theme Manager
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </Link>
          </div>
        </div>

        <div className="text-xs text-muted-foreground space-y-2">
          <p className="font-medium">Available in Theme Manager:</p>
          <ul className="list-disc list-inside space-y-1 ml-2">
            <li>Complete color system with 11-shade scales</li>
            <li>Typography: font families, sizes, weights, and spacing</li>
            <li>Spacing scale with 34 values</li>
            <li>Border radius, shadows, and transitions</li>
            <li>Live CSS preview and export</li>
          </ul>
        </div>
      </CardContent>
    </Card>
  );
}
