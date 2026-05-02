"use client";

import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";

interface NewsletterBlockData {
  _key: string;
  _type: "newsletter-block";
  data: {
    heading?: string;
    description?: string;
    placeholder?: string;
    buttonText?: string;
    successMessage?: string;
    endpoint?: string; // Form submission URL (API route)
    provider?: "internal" | "mailchimp" | "webhook" | "none";
    listId?: string; // Mailchimp list id / provider list
    layout?: "inline" | "stacked";
  };
}

interface NewsletterBlockEditorProps {
  block: NewsletterBlockData;
  onChange: (block: NewsletterBlockData) => void;
  onDelete: () => void;
}

export function NewsletterBlockEditor({
  block,
  onChange,
}: NewsletterBlockEditorProps) {
  const { data } = block;
  const handleChange = (field: string, value: unknown) => {
    onChange({ ...block, data: { ...data, [field]: value } });
  };

  return (
    <div className="space-y-3">
      <div>
        <label className="text-[12px] font-semibold">Heading</label>
        <Input
          value={data.heading || ""}
          onChange={(e) => handleChange("heading", e.target.value)}
          placeholder="Join our newsletter"
        />
      </div>
      <div>
        <label className="text-[12px] font-semibold">Description</label>
        <Textarea
          value={data.description || ""}
          onChange={(e) => handleChange("description", e.target.value)}
          placeholder="Get weekly updates straight to your inbox."
        />
      </div>
      <div>
        <label className="text-[12px] font-semibold">Input placeholder</label>
        <Input
          value={data.placeholder || ""}
          onChange={(e) => handleChange("placeholder", e.target.value)}
          placeholder="your@email.com"
        />
      </div>
      <div>
        <label className="text-[12px] font-semibold">Button text</label>
        <Input
          value={data.buttonText || ""}
          onChange={(e) => handleChange("buttonText", e.target.value)}
          placeholder="Subscribe"
        />
      </div>
      <div>
        <label className="text-[12px] font-semibold">Success message</label>
        <Input
          value={data.successMessage || ""}
          onChange={(e) => handleChange("successMessage", e.target.value)}
          placeholder="Thanks! Please check your inbox."
        />
      </div>
      <div>
        <label className="text-[12px] font-semibold">Endpoint (optional)</label>
        <Input
          value={data.endpoint || ""}
          onChange={(e) => handleChange("endpoint", e.target.value)}
          placeholder="/api/newsletter"
        />
        <p className="text-[11px] text-(--el-500) mt-1">
          Leave blank to use the default tenant endpoint.
        </p>
      </div>
    </div>
  );
}
