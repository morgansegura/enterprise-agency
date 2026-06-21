"use client";

import * as React from "react";
import dynamic from "next/dynamic";

import { Modal, ModalContent, ModalTrigger } from "@/components/ui";
import { cn } from "@/lib/utils";

import "./evaluation-cta.css";

// Lazy: the modal body (radix Select + ToggleGroup + routing logic) only loads
// once a user opens the modal, keeping it off every page's initial bundle.
const EvaluationForm = dynamic(
  () => import("./evaluation-form").then((m) => m.EvaluationForm),
  { ssr: false },
);

type EvaluationCTAProps = {
  className?: string;
  children?: React.ReactNode;
  label?: string;
  variant?: "default" | "secondary" | "outline";
};

export function EvaluationCTA({
  className,
  children,
  label = "Request an Evaluation",
  variant = "default",
}: EvaluationCTAProps) {
  const [open, setOpen] = React.useState(false);

  return (
    <Modal open={open} onOpenChange={setOpen}>
      <ModalTrigger
        data-variant={variant}
        className={cn("evaluation-cta-trigger", className)}
      >
        {children ?? label}
      </ModalTrigger>

      <ModalContent
        title="Request an Evaluation"
        description="Choose a track and birth year to be routed to the correct registration."
      >
        {open ? <EvaluationForm onClose={() => setOpen(false)} /> : null}
      </ModalContent>
    </Modal>
  );
}
