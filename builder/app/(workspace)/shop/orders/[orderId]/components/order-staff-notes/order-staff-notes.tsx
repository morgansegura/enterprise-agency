import { StickyNote } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";

import "./order-staff-notes.css";

interface OrderStaffNotesProps {
  staffNote: string;
  onChange: (value: string) => void;
  onSave: () => void;
  isDirty: boolean;
  isPending: boolean;
}

export function OrderStaffNotes({
  staffNote,
  onChange,
  onSave,
  isDirty,
  isPending,
}: OrderStaffNotesProps) {
  return (
    <div className="order-detail-card">
      <div className="order-detail-card-header">
        <h2 className="order-detail-card-title">
          <StickyNote className="inline h-4 w-4 mr-1.5" />
          Staff Notes
        </h2>
        {isDirty && (
          <Button size="sm" onClick={onSave} disabled={isPending}>
            {isPending ? "Saving..." : "Save"}
          </Button>
        )}
      </div>
      <div className="order-detail-card-body">
        <Textarea
          value={staffNote}
          onChange={(e) => onChange(e.target.value)}
          placeholder="Add an internal note about this order..."
          rows={3}
        />
      </div>
    </div>
  );
}
