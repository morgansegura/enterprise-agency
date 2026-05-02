"use client";

import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Plus, Trash2 } from "lucide-react";

type Platform =
  | "facebook"
  | "twitter"
  | "instagram"
  | "linkedin"
  | "youtube"
  | "tiktok"
  | "github"
  | "dribbble"
  | "behance"
  | "pinterest";

interface SocialLink {
  platform: Platform | string;
  url: string;
}

interface SocialLinksBlockData {
  _key: string;
  _type: "social-links-block";
  data: {
    links?: SocialLink[];
    size?: "sm" | "md" | "lg";
    variant?: "default" | "filled" | "outline";
    align?: "left" | "center" | "right";
  };
}

interface SocialLinksBlockEditorProps {
  block: SocialLinksBlockData;
  onChange: (block: SocialLinksBlockData) => void;
  onDelete: () => void;
}

const PLATFORMS: Platform[] = [
  "facebook",
  "twitter",
  "instagram",
  "linkedin",
  "youtube",
  "tiktok",
  "github",
  "dribbble",
  "behance",
  "pinterest",
];

export function SocialLinksBlockEditor({
  block,
  onChange,
}: SocialLinksBlockEditorProps) {
  const { data } = block;
  const links = data.links ?? [];

  const setData = (patch: Partial<SocialLinksBlockData["data"]>) => {
    onChange({ ...block, data: { ...data, ...patch } });
  };

  const updateLink = (index: number, patch: Partial<SocialLink>) => {
    const next = links.map((l, i) => (i === index ? { ...l, ...patch } : l));
    setData({ links: next });
  };

  const addLink = () => {
    setData({ links: [...links, { platform: "twitter", url: "" }] });
  };

  const removeLink = (index: number) => {
    setData({ links: links.filter((_, i) => i !== index) });
  };

  return (
    <div className="space-y-4">
      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <label className="text-[12px] font-semibold">Links</label>
          <Button
            variant="ghost"
            size="sm"
            onClick={addLink}
            className="h-7 px-2 text-[11px]"
          >
            <Plus className="size-3" /> Add link
          </Button>
        </div>

        {links.length === 0 ? (
          <p className="text-[11px] text-(--el-500)">No links yet.</p>
        ) : (
          <ul className="space-y-2">
            {links.map((link, i) => (
              <li key={i} className="flex items-center gap-1.5">
                <Select
                  value={link.platform}
                  onValueChange={(v) => updateLink(i, { platform: v })}
                >
                  <SelectTrigger className="w-28 h-8 text-[12px]">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {PLATFORMS.map((p) => (
                      <SelectItem key={p} value={p} className="text-[12px]">
                        {p}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <Input
                  value={link.url}
                  onChange={(e) => updateLink(i, { url: e.target.value })}
                  placeholder="https://…"
                  className="h-8 text-[12px]"
                />
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => removeLink(i)}
                  className="size-8 shrink-0"
                  aria-label="Remove link"
                >
                  <Trash2 className="size-3.5" />
                </Button>
              </li>
            ))}
          </ul>
        )}
      </div>

      <div className="grid grid-cols-3 gap-2">
        <div>
          <label className="text-[12px] font-semibold">Size</label>
          <Select
            value={data.size ?? "md"}
            onValueChange={(v) => setData({ size: v as "sm" | "md" | "lg" })}
          >
            <SelectTrigger className="h-8 text-[12px]">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="sm">Small</SelectItem>
              <SelectItem value="md">Medium</SelectItem>
              <SelectItem value="lg">Large</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <div>
          <label className="text-[12px] font-semibold">Style</label>
          <Select
            value={data.variant ?? "default"}
            onValueChange={(v) =>
              setData({ variant: v as "default" | "filled" | "outline" })
            }
          >
            <SelectTrigger className="h-8 text-[12px]">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="default">Default</SelectItem>
              <SelectItem value="filled">Filled</SelectItem>
              <SelectItem value="outline">Outline</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <div>
          <label className="text-[12px] font-semibold">Align</label>
          <Select
            value={data.align ?? "left"}
            onValueChange={(v) =>
              setData({ align: v as "left" | "center" | "right" })
            }
          >
            <SelectTrigger className="h-8 text-[12px]">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="left">Left</SelectItem>
              <SelectItem value="center">Center</SelectItem>
              <SelectItem value="right">Right</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>
    </div>
  );
}
