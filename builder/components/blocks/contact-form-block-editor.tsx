"use client";

import { Input } from "@/components/ui/input";

interface ContactFormBlockData {
  _key: string;
  _type: "contact-form-block";
  data: {
    heading?: string;
    description?: string;
    fields: Array<{ label: string; type: string; required: boolean }>;
    submitText?: string;
    recipientEmail?: string;
  };
}

interface ContactFormBlockEditorProps {
  block: ContactFormBlockData;
  onChange: (block: ContactFormBlockData) => void;
  onDelete: () => void;
}

export function ContactFormBlockEditor({
  block,
  onChange,
}: ContactFormBlockEditorProps) {
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
          placeholder="Contact Us"
        />
      </div>
      <div>
        <label className="text-[12px] font-semibold">Submit Button Text</label>
        <Input
          value={data.submitText || ""}
          onChange={(e) => handleChange("submitText", e.target.value)}
          placeholder="Send Message"
        />
      </div>
      <div>
        <label className="text-[12px] font-semibold">Recipient Email</label>
        <Input
          value={data.recipientEmail || ""}
          onChange={(e) => handleChange("recipientEmail", e.target.value)}
          placeholder="you@company.com"
        />
      </div>
    </div>
  );
}
