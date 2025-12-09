"use client";

import * as React from "react";
import { toast } from "sonner";
import { LayoutHeading } from "@/components/layout/layout-heading";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  usePaymentConfig,
  useUpdatePaymentConfig,
  type PaymentProvider,
  type UpdatePaymentConfigDto,
} from "@/lib/hooks/use-payments";
import {
  CreditCard,
  Check,
  AlertCircle,
  Eye,
  EyeOff,
  Loader2,
} from "lucide-react";

export default function PaymentSettingsPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const resolvedParams = React.use(params);
  const { id } = resolvedParams;

  const { data: config, isLoading, error } = usePaymentConfig(id);
  const updateConfig = useUpdatePaymentConfig(id);

  // Stripe form state
  const [stripePublishableKey, setStripePublishableKey] = React.useState("");
  const [stripeSecretKey, setStripeSecretKey] = React.useState("");
  const [stripeWebhookSecret, setStripeWebhookSecret] = React.useState("");
  const [showStripeSecrets, setShowStripeSecrets] = React.useState(false);

  // Square form state
  const [squareApplicationId, setSquareApplicationId] = React.useState("");
  const [squareAccessToken, setSquareAccessToken] = React.useState("");
  const [squareLocationId, setSquareLocationId] = React.useState("");
  const [squareWebhookKey, setSquareWebhookKey] = React.useState("");
  const [showSquareSecrets, setShowSquareSecrets] = React.useState(false);

  const handleSaveStripe = async () => {
    const dto: UpdatePaymentConfigDto = {
      provider: "stripe",
      stripe: {
        ...(stripePublishableKey && { publishableKey: stripePublishableKey }),
        ...(stripeSecretKey && { secretKey: stripeSecretKey }),
        ...(stripeWebhookSecret && { webhookSecret: stripeWebhookSecret }),
      },
    };

    try {
      await updateConfig.mutateAsync(dto);
      toast.success("Stripe configuration saved");
      // Clear sensitive fields after save
      setStripeSecretKey("");
      setStripeWebhookSecret("");
    } catch {
      toast.error("Failed to save Stripe configuration");
    }
  };

  const handleSaveSquare = async () => {
    const dto: UpdatePaymentConfigDto = {
      provider: "square",
      square: {
        ...(squareApplicationId && { applicationId: squareApplicationId }),
        ...(squareAccessToken && { accessToken: squareAccessToken }),
        ...(squareLocationId && { locationId: squareLocationId }),
        ...(squareWebhookKey && { webhookSignatureKey: squareWebhookKey }),
      },
    };

    try {
      await updateConfig.mutateAsync(dto);
      toast.success("Square configuration saved");
      // Clear sensitive fields after save
      setSquareAccessToken("");
      setSquareWebhookKey("");
    } catch {
      toast.error("Failed to save Square configuration");
    }
  };

  const handleActivateProvider = async (provider: PaymentProvider) => {
    const dto: UpdatePaymentConfigDto = {
      provider,
    };

    try {
      await updateConfig.mutateAsync(dto);
      toast.success(
        `${provider === "stripe" ? "Stripe" : "Square"} activated as payment provider`,
      );
    } catch {
      toast.error("Failed to activate payment provider");
    }
  };

  if (isLoading) {
    return (
      <div className="p-6 flex items-center justify-center">
        <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-6">
        <div className="flex items-center gap-2 text-destructive">
          <AlertCircle className="h-5 w-5" />
          <span>Error loading payment configuration</span>
        </div>
      </div>
    );
  }

  const activeProvider = config?.provider;

  return (
    <div className="p-6">
      <LayoutHeading
        title="Payment Settings"
        description="Configure payment providers for your store"
      />

      <div className="mt-6">
        {/* Active Provider Status */}
        <Card className="mb-6">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <CreditCard className="h-5 w-5" />
              Active Payment Provider
            </CardTitle>
            <CardDescription>
              {activeProvider
                ? `Currently using ${activeProvider === "stripe" ? "Stripe" : "Square"} for payments`
                : "No payment provider configured yet"}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex gap-4">
              <div
                className={`flex items-center gap-2 px-4 py-2 rounded-lg border ${
                  activeProvider === "stripe"
                    ? "border-green-500 bg-green-50 text-green-700"
                    : "border-muted"
                }`}
              >
                {activeProvider === "stripe" && <Check className="h-4 w-4" />}
                <span className="font-medium">Stripe</span>
                {config?.stripe?.isConfigured && (
                  <span className="text-xs bg-green-100 text-green-700 px-2 py-0.5 rounded">
                    Configured
                  </span>
                )}
              </div>
              <div
                className={`flex items-center gap-2 px-4 py-2 rounded-lg border ${
                  activeProvider === "square"
                    ? "border-green-500 bg-green-50 text-green-700"
                    : "border-muted"
                }`}
              >
                {activeProvider === "square" && <Check className="h-4 w-4" />}
                <span className="font-medium">Square</span>
                {config?.square?.isConfigured && (
                  <span className="text-xs bg-green-100 text-green-700 px-2 py-0.5 rounded">
                    Configured
                  </span>
                )}
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Provider Configuration Tabs */}
        <Tabs defaultValue="stripe">
          <TabsList>
            <TabsTrigger value="stripe">Stripe</TabsTrigger>
            <TabsTrigger value="square">Square</TabsTrigger>
          </TabsList>

          {/* Stripe Configuration */}
          <TabsContent value="stripe">
            <Card>
              <CardHeader>
                <CardTitle>Stripe Configuration</CardTitle>
                <CardDescription>
                  Enter your Stripe API keys from the{" "}
                  <a
                    href="https://dashboard.stripe.com/apikeys"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-primary underline"
                  >
                    Stripe Dashboard
                  </a>
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="stripe-publishable">Publishable Key</Label>
                  <Input
                    id="stripe-publishable"
                    type="text"
                    placeholder={
                      config?.stripe?.publishableKey ||
                      "pk_live_... or pk_test_..."
                    }
                    value={stripePublishableKey}
                    onChange={(e) => setStripePublishableKey(e.target.value)}
                  />
                  {config?.stripe?.publishableKey && !stripePublishableKey && (
                    <p className="text-xs text-muted-foreground">
                      Current: {config.stripe.publishableKey.substring(0, 20)}
                      ...
                    </p>
                  )}
                </div>

                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <Label htmlFor="stripe-secret">Secret Key</Label>
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      onClick={() => setShowStripeSecrets(!showStripeSecrets)}
                    >
                      {showStripeSecrets ? (
                        <EyeOff className="h-4 w-4" />
                      ) : (
                        <Eye className="h-4 w-4" />
                      )}
                    </Button>
                  </div>
                  <Input
                    id="stripe-secret"
                    type={showStripeSecrets ? "text" : "password"}
                    placeholder="sk_live_... or sk_test_..."
                    value={stripeSecretKey}
                    onChange={(e) => setStripeSecretKey(e.target.value)}
                  />
                  <p className="text-xs text-muted-foreground">
                    Secret keys are never displayed after saving
                  </p>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="stripe-webhook">Webhook Secret</Label>
                  <Input
                    id="stripe-webhook"
                    type={showStripeSecrets ? "text" : "password"}
                    placeholder="whsec_..."
                    value={stripeWebhookSecret}
                    onChange={(e) => setStripeWebhookSecret(e.target.value)}
                  />
                  <p className="text-xs text-muted-foreground">
                    Webhook URL:{" "}
                    <code className="bg-muted px-1 rounded">
                      /api/payments/webhooks/stripe/{id}
                    </code>
                  </p>
                </div>

                <div className="flex gap-2 pt-4">
                  <Button
                    onClick={handleSaveStripe}
                    disabled={updateConfig.isPending}
                  >
                    {updateConfig.isPending ? (
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    ) : null}
                    Save Stripe Settings
                  </Button>
                  {config?.stripe?.isConfigured &&
                    activeProvider !== "stripe" && (
                      <Button
                        variant="outline"
                        onClick={() => handleActivateProvider("stripe")}
                        disabled={updateConfig.isPending}
                      >
                        Activate Stripe
                      </Button>
                    )}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Square Configuration */}
          <TabsContent value="square">
            <Card>
              <CardHeader>
                <CardTitle>Square Configuration</CardTitle>
                <CardDescription>
                  Enter your Square API credentials from the{" "}
                  <a
                    href="https://developer.squareup.com/apps"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-primary underline"
                  >
                    Square Developer Dashboard
                  </a>
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="square-app-id">Application ID</Label>
                  <Input
                    id="square-app-id"
                    type="text"
                    placeholder={config?.square?.applicationId || "sq0idp-..."}
                    value={squareApplicationId}
                    onChange={(e) => setSquareApplicationId(e.target.value)}
                  />
                  {config?.square?.applicationId && !squareApplicationId && (
                    <p className="text-xs text-muted-foreground">
                      Current: {config.square.applicationId.substring(0, 15)}...
                    </p>
                  )}
                </div>

                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <Label htmlFor="square-access-token">Access Token</Label>
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      onClick={() => setShowSquareSecrets(!showSquareSecrets)}
                    >
                      {showSquareSecrets ? (
                        <EyeOff className="h-4 w-4" />
                      ) : (
                        <Eye className="h-4 w-4" />
                      )}
                    </Button>
                  </div>
                  <Input
                    id="square-access-token"
                    type={showSquareSecrets ? "text" : "password"}
                    placeholder="EAAAl..."
                    value={squareAccessToken}
                    onChange={(e) => setSquareAccessToken(e.target.value)}
                  />
                  <p className="text-xs text-muted-foreground">
                    Access tokens are never displayed after saving
                  </p>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="square-location">Location ID</Label>
                  <Input
                    id="square-location"
                    type="text"
                    placeholder={config?.square?.locationId || "L1234567890"}
                    value={squareLocationId}
                    onChange={(e) => setSquareLocationId(e.target.value)}
                  />
                  {config?.square?.locationId && !squareLocationId && (
                    <p className="text-xs text-muted-foreground">
                      Current: {config.square.locationId}
                    </p>
                  )}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="square-webhook">Webhook Signature Key</Label>
                  <Input
                    id="square-webhook"
                    type={showSquareSecrets ? "text" : "password"}
                    placeholder="Webhook signature key"
                    value={squareWebhookKey}
                    onChange={(e) => setSquareWebhookKey(e.target.value)}
                  />
                  <p className="text-xs text-muted-foreground">
                    Webhook URL:{" "}
                    <code className="bg-muted px-1 rounded">
                      /api/payments/webhooks/square/{id}
                    </code>
                  </p>
                </div>

                <div className="flex gap-2 pt-4">
                  <Button
                    onClick={handleSaveSquare}
                    disabled={updateConfig.isPending}
                  >
                    {updateConfig.isPending ? (
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    ) : null}
                    Save Square Settings
                  </Button>
                  {config?.square?.isConfigured &&
                    activeProvider !== "square" && (
                      <Button
                        variant="outline"
                        onClick={() => handleActivateProvider("square")}
                        disabled={updateConfig.isPending}
                      >
                        Activate Square
                      </Button>
                    )}
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
