"use client";

import { useState } from "react";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import {
  Trash2,
  CreditCard,
  X,
  PlusCircle,
  Plus,
  Minus,
} from "lucide-react";
import { FormItem } from "@/components/ui/form";
import {
  useCurrentBreakpoint,
  useCanSetResponsiveOverrides,
} from "@/lib/responsive/context";

interface PricingTier {
  name: string;
  price: string;
  period?: string;
  description?: string;
  features: string[];
  cta: { text: string; href: string };
  highlighted?: boolean;
}

interface PricingBlockData {
  _key: string;
  _type: "pricing-block";
  data: {
    tiers: PricingTier[];
    heading?: string;
    description?: string;
    variant?: "default" | "bordered" | "elevated";
  };
}

interface PricingBlockEditorProps {
  block: PricingBlockData;
  onChange: (block: PricingBlockData) => void;
  onDelete: () => void;
}

export function PricingBlockEditor({
  block,
  onChange,
  onDelete,
}: PricingBlockEditorProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [expandedTiers, setExpandedTiers] = useState<number[]>([0]);
  const breakpoint = useCurrentBreakpoint();
  const canSetOverrides = useCanSetResponsiveOverrides();

  const handleDataChange = (field: string, value: unknown) => {
    onChange({
      ...block,
      data: {
        ...block.data,
        [field]: value,
      },
    });
  };

  const handleTiersChange = (tiers: PricingTier[]) => {
    onChange({
      ...block,
      data: {
        ...block.data,
        tiers,
      },
    });
  };

  const handleTierChange = (
    index: number,
    field: keyof PricingTier,
    value: unknown,
  ) => {
    const updated = [...block.data.tiers];
    updated[index] = { ...updated[index], [field]: value };
    handleTiersChange(updated);
  };

  const handleCtaChange = (
    index: number,
    field: keyof PricingTier["cta"],
    value: string,
  ) => {
    const updated = [...block.data.tiers];
    updated[index] = {
      ...updated[index],
      cta: { ...updated[index].cta, [field]: value },
    };
    handleTiersChange(updated);
  };

  const handleFeatureChange = (
    tierIndex: number,
    featureIndex: number,
    value: string,
  ) => {
    const updated = [...block.data.tiers];
    const features = [...updated[tierIndex].features];
    features[featureIndex] = value;
    updated[tierIndex] = { ...updated[tierIndex], features };
    handleTiersChange(updated);
  };

  const handleAddFeature = (tierIndex: number) => {
    const updated = [...block.data.tiers];
    updated[tierIndex] = {
      ...updated[tierIndex],
      features: [...updated[tierIndex].features, ""],
    };
    handleTiersChange(updated);
  };

  const handleRemoveFeature = (tierIndex: number, featureIndex: number) => {
    const updated = [...block.data.tiers];
    updated[tierIndex] = {
      ...updated[tierIndex],
      features: updated[tierIndex].features.filter(
        (_, i) => i !== featureIndex,
      ),
    };
    handleTiersChange(updated);
  };

  const handleAddTier = () => {
    const updated = [
      ...block.data.tiers,
      {
        name: "",
        price: "",
        period: "/mo",
        description: "",
        features: [""],
        cta: { text: "Get Started", href: "#" },
        highlighted: false,
      },
    ];
    handleTiersChange(updated);
  };

  const handleRemoveTier = (index: number) => {
    const updated = block.data.tiers.filter((_, i) => i !== index);
    handleTiersChange(updated);
  };

  const toggleTier = (index: number) => {
    setExpandedTiers((prev) =>
      prev.includes(index)
        ? prev.filter((i) => i !== index)
        : [...prev, index],
    );
  };

  const variant = block.data.variant || "default";

  const variantStyles = {
    default: "",
    bordered: "border-2 rounded-lg",
    elevated: "shadow-lg rounded-lg",
  };

  if (!isEditing) {
    return (
      <div
        className="group relative border-2 border-dashed border-border rounded-lg p-4 hover:border-primary cursor-pointer transition-colors"
        onClick={() => setIsEditing(true)}
      >
        {block.data.heading && (
          <h3 className="text-lg font-bold text-center mb-1">
            {block.data.heading}
          </h3>
        )}
        {block.data.description && (
          <p className="text-sm text-[var(--el-500)] text-center mb-4">
            {block.data.description}
          </p>
        )}
        <div className="grid grid-cols-3 gap-4">
          {block.data.tiers.length === 0 ? (
            <div className="col-span-full text-center text-[var(--el-500)] py-4">
              No pricing tiers yet. Click to add tiers...
            </div>
          ) : (
            block.data.tiers.map((tier, index) => (
              <div
                key={index}
                className={`p-4 text-center ${variantStyles[variant]} ${tier.highlighted ? "border-primary ring-2 ring-primary/20" : ""}`}
              >
                <div className="text-sm font-medium">
                  {tier.name || "Plan"}
                </div>
                <div className="text-2xl font-bold mt-1">
                  {tier.price || "$0"}
                  {tier.period && (
                    <span className="text-sm font-normal text-[var(--el-500)]">
                      {tier.period}
                    </span>
                  )}
                </div>
                <div className="text-xs text-[var(--el-500)] mt-2">
                  {tier.features.length} feature
                  {tier.features.length !== 1 ? "s" : ""}
                </div>
              </div>
            ))
          )}
        </div>
        <Button
          variant="destructive"
          size="icon-sm"
          className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity"
          onClick={(e) => {
            e.stopPropagation();
            onDelete();
          }}
        >
          <Trash2 className="h-3 w-3" />
        </Button>
      </div>
    );
  }

  return (
    <div className="border-2 border-primary rounded-lg p-4 space-y-4">
      <div className="flex items-center justify-between">
        <h4 className="font-semibold text-sm flex items-center gap-2">
          <CreditCard className="h-4 w-4" />
          Pricing Block
          {canSetOverrides && breakpoint !== "desktop" && (
            <span className="text-xs font-normal text-blue-500 bg-blue-500/10 px-2 py-0.5 rounded">
              Editing {breakpoint}
            </span>
          )}
        </h4>
        <div className="flex gap-2">
          <Button size="sm" onClick={() => setIsEditing(false)}>
            Done
          </Button>
          <Button variant="destructive" size="sm" onClick={onDelete}>
            <Trash2 className="h-3 w-3" />
          </Button>
        </div>
      </div>

      <div className="space-y-3">
        <FormItem>
          <Label htmlFor="pricing-heading">Heading (Optional)</Label>
          <Input
            id="pricing-heading"
            value={block.data.heading || ""}
            onChange={(e) => handleDataChange("heading", e.target.value)}
            placeholder="Choose Your Plan"
          />
        </FormItem>

        <FormItem>
          <Label htmlFor="pricing-description">
            Description (Optional)
          </Label>
          <Textarea
            id="pricing-description"
            value={block.data.description || ""}
            onChange={(e) =>
              handleDataChange("description", e.target.value)
            }
            placeholder="Find the perfect plan for your needs."
            rows={2}
          />
        </FormItem>

        <FormItem>
          <Label htmlFor="pricing-variant">Style</Label>
          <Select
            value={variant}
            onValueChange={(value) => handleDataChange("variant", value)}
          >
            <SelectTrigger id="pricing-variant">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="default">Default</SelectItem>
              <SelectItem value="bordered">Bordered</SelectItem>
              <SelectItem value="elevated">Elevated</SelectItem>
            </SelectContent>
          </Select>
        </FormItem>

        <div>
          <FormItem className="flex items-center justify-between mb-2">
            <Label>Pricing Tiers</Label>
            <Button
              type="button"
              size="sm"
              variant="outline"
              onClick={handleAddTier}
            >
              <PlusCircle className="h-3 w-3 mr-1" />
              Add Tier
            </Button>
          </FormItem>

          <div className="space-y-3">
            {block.data.tiers.map((tier, index) => (
              <div
                key={index}
                className="border rounded-lg p-3 space-y-2 bg-[var(--el-100)]/30"
              >
                <div className="flex items-start justify-between gap-2">
                  <Button
                    type="button"
                    onClick={() => toggleTier(index)}
                    className="flex-1 text-left"
                  >
                    <div className="text-sm font-medium">
                      {tier.name || `Tier ${index + 1}`}
                    </div>
                    <div className="text-xs text-[var(--el-500)]">
                      {tier.price || "$0"}
                      {tier.period}
                      {tier.highlighted && " (highlighted)"}
                    </div>
                  </Button>
                  <Button
                    type="button"
                    variant="ghost"
                    size="icon-sm"
                    onClick={() => handleRemoveTier(index)}
                    disabled={block.data.tiers.length === 1}
                  >
                    <X className="h-4 w-4" />
                  </Button>
                </div>

                {expandedTiers.includes(index) && (
                  <div className="space-y-2 pt-2">
                    <div className="grid grid-cols-2 gap-2">
                      <FormItem>
                        <Label htmlFor={`tier-${index}-name`}>Name</Label>
                        <Input
                          id={`tier-${index}-name`}
                          value={tier.name}
                          onChange={(e) =>
                            handleTierChange(index, "name", e.target.value)
                          }
                          placeholder="Pro"
                        />
                      </FormItem>
                      <FormItem>
                        <Label htmlFor={`tier-${index}-price`}>
                          Price
                        </Label>
                        <Input
                          id={`tier-${index}-price`}
                          value={tier.price}
                          onChange={(e) =>
                            handleTierChange(
                              index,
                              "price",
                              e.target.value,
                            )
                          }
                          placeholder="$49"
                        />
                      </FormItem>
                    </div>
                    <div className="grid grid-cols-2 gap-2">
                      <FormItem>
                        <Label htmlFor={`tier-${index}-period`}>
                          Period (Optional)
                        </Label>
                        <Input
                          id={`tier-${index}-period`}
                          value={tier.period || ""}
                          onChange={(e) =>
                            handleTierChange(
                              index,
                              "period",
                              e.target.value,
                            )
                          }
                          placeholder="/mo"
                        />
                      </FormItem>
                      <FormItem className="flex items-center gap-2 pt-6">
                        <Input
                          type="checkbox"
                          id={`tier-${index}-highlighted`}
                          checked={tier.highlighted || false}
                          onChange={(e) =>
                            handleTierChange(
                              index,
                              "highlighted",
                              e.target.checked,
                            )
                          }
                          className="h-4 w-4"
                        />
                        <Label
                          htmlFor={`tier-${index}-highlighted`}
                          className="cursor-pointer"
                        >
                          Highlighted
                        </Label>
                      </FormItem>
                    </div>
                    <FormItem>
                      <Label htmlFor={`tier-${index}-description`}>
                        Description (Optional)
                      </Label>
                      <Textarea
                        id={`tier-${index}-description`}
                        value={tier.description || ""}
                        onChange={(e) =>
                          handleTierChange(
                            index,
                            "description",
                            e.target.value,
                          )
                        }
                        placeholder="Best for growing teams."
                        rows={2}
                      />
                    </FormItem>

                    <div>
                      <FormItem className="flex items-center justify-between mb-2">
                        <Label>Features</Label>
                        <Button
                          type="button"
                          size="sm"
                          variant="ghost"
                          onClick={() => handleAddFeature(index)}
                        >
                          <Plus className="h-3 w-3 mr-1" />
                          Add
                        </Button>
                      </FormItem>
                      <div className="space-y-1">
                        {tier.features.map((feature, fIndex) => (
                          <div
                            key={fIndex}
                            className="flex items-center gap-1"
                          >
                            <Input
                              value={feature}
                              onChange={(e) =>
                                handleFeatureChange(
                                  index,
                                  fIndex,
                                  e.target.value,
                                )
                              }
                              placeholder="Feature description"
                            />
                            <Button
                              type="button"
                              variant="ghost"
                              size="icon-sm"
                              onClick={() =>
                                handleRemoveFeature(index, fIndex)
                              }
                              disabled={tier.features.length === 1}
                            >
                              <Minus className="h-3 w-3" />
                            </Button>
                          </div>
                        ))}
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-2">
                      <FormItem>
                        <Label htmlFor={`tier-${index}-cta-text`}>
                          CTA Text
                        </Label>
                        <Input
                          id={`tier-${index}-cta-text`}
                          value={tier.cta.text}
                          onChange={(e) =>
                            handleCtaChange(
                              index,
                              "text",
                              e.target.value,
                            )
                          }
                          placeholder="Get Started"
                        />
                      </FormItem>
                      <FormItem>
                        <Label htmlFor={`tier-${index}-cta-href`}>
                          CTA Link
                        </Label>
                        <Input
                          id={`tier-${index}-cta-href`}
                          value={tier.cta.href}
                          onChange={(e) =>
                            handleCtaChange(
                              index,
                              "href",
                              e.target.value,
                            )
                          }
                          placeholder="/signup"
                        />
                      </FormItem>
                    </div>
                  </div>
                )}
              </div>
            ))}
            {block.data.tiers.length === 0 && (
              <p className="text-sm text-[var(--el-500)] text-center py-4">
                No tiers yet. Click &quot;Add Tier&quot; to start.
              </p>
            )}
          </div>
        </div>

        <div className="border rounded-lg p-4 bg-[var(--el-100)]/30">
          <p className="text-xs text-[var(--el-500)] mb-2">
            Preview ({breakpoint}):
          </p>
          {block.data.heading && (
            <h3 className="text-lg font-bold text-center mb-1">
              {block.data.heading}
            </h3>
          )}
          {block.data.description && (
            <p className="text-sm text-[var(--el-500)] text-center mb-4">
              {block.data.description}
            </p>
          )}
          <div className="grid grid-cols-3 gap-4">
            {block.data.tiers.length === 0 ? (
              <div className="col-span-full text-center text-[var(--el-500)] py-4">
                No tiers yet
              </div>
            ) : (
              block.data.tiers.map((tier, index) => (
                <div
                  key={index}
                  className={`p-4 text-center ${variantStyles[variant]} ${tier.highlighted ? "border-primary ring-2 ring-primary/20" : ""}`}
                >
                  <div className="text-sm font-medium">
                    {tier.name || "Plan"}
                  </div>
                  <div className="text-2xl font-bold mt-1">
                    {tier.price || "$0"}
                    {tier.period && (
                      <span className="text-sm font-normal text-[var(--el-500)]">
                        {tier.period}
                      </span>
                    )}
                  </div>
                  {tier.description && (
                    <p className="text-xs text-[var(--el-500)] mt-2">
                      {tier.description}
                    </p>
                  )}
                  <ul className="text-xs text-left mt-3 space-y-1">
                    {tier.features
                      .filter((f) => f)
                      .map((feature, fIndex) => (
                        <li key={fIndex}>&#10003; {feature}</li>
                      ))}
                  </ul>
                  <div className="mt-3">
                    <span className="text-xs font-medium text-[var(--accent-primary)]">
                      {tier.cta.text || "Get Started"}
                    </span>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
