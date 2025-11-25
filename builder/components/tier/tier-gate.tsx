"use client";

import * as React from "react";
import { useHasTier, type TenantTier } from "@/lib/hooks";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Lock, Sparkles } from "lucide-react";

interface TierGateProps {
  tenantId: string;
  requiredTier: TenantTier;
  children: React.ReactNode;
  /**
   * Custom fallback to show when tier requirement is not met
   * If not provided, shows default upgrade prompt
   */
  fallback?: React.ReactNode;
  /**
   * If true, hides content completely instead of showing upgrade prompt
   */
  hideWhenLocked?: boolean;
}

/**
 * Component to gate content behind a tier requirement
 * Shows upgrade prompt if user doesn't have required tier
 *
 * @example
 * ```tsx
 * <TierGate tenantId={id} requiredTier="BUILDER">
 *   <AddBlockButton />
 * </TierGate>
 * ```
 */
export function TierGate({
  tenantId,
  requiredTier,
  children,
  fallback,
  hideWhenLocked = false,
}: TierGateProps) {
  const hasTier = useHasTier(tenantId, requiredTier);

  // Show children if tier requirement is met
  if (hasTier) {
    return <>{children}</>;
  }

  // Hide completely if hideWhenLocked is true
  if (hideWhenLocked) {
    return null;
  }

  // Show custom fallback if provided
  if (fallback) {
    return <>{fallback}</>;
  }

  // Show default upgrade prompt
  return (
    <Card className="border-primary/20 bg-primary/5">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-base">
          <Sparkles className="h-4 w-4 text-primary" />
          Upgrade to {requiredTier === "BUILDER"
            ? "Builder"
            : "Content Editor"}{" "}
          Tier
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-3">
        <div className="flex items-start gap-3">
          <Lock className="h-4 w-4 mt-0.5 text-muted-foreground" />
          <p className="text-sm text-muted-foreground">
            {requiredTier === "BUILDER"
              ? "This feature requires the Builder tier. Upgrade to unlock full builder access, custom layouts, and advanced features."
              : "This feature requires the Content Editor tier or higher."}
          </p>
        </div>
        <Button size="sm">Upgrade Now</Button>
      </CardContent>
    </Card>
  );
}
