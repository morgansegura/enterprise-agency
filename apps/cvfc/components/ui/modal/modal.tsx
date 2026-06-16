"use client";

import * as React from "react";
import { Dialog as DialogPrimitive } from "@base-ui/react/dialog";

import { cn } from "@/lib/utils";

import "./modal.css";

const Modal = DialogPrimitive.Root;
const ModalTrigger = DialogPrimitive.Trigger;
const ModalClose = DialogPrimitive.Close;

type ModalContentProps = Omit<
  React.ComponentProps<typeof DialogPrimitive.Popup>,
  "title"
> & {
  title: string;
  description?: string;
  size?: "sm" | "md" | "lg";
};

function ModalContent({
  title,
  description,
  size = "md",
  className,
  children,
  ...props
}: ModalContentProps) {
  return (
    <DialogPrimitive.Portal>
      <DialogPrimitive.Backdrop className="modal-backdrop" />
      <DialogPrimitive.Popup
        data-slot="modal"
        data-size={size}
        className={cn("modal", `modal-${size}`, className)}
        {...props}
      >
        <DialogPrimitive.Title className="sr-only">
          {title}
        </DialogPrimitive.Title>
        {description ? (
          <DialogPrimitive.Description className="sr-only">
            {description}
          </DialogPrimitive.Description>
        ) : null}
        {children}
      </DialogPrimitive.Popup>
    </DialogPrimitive.Portal>
  );
}

export { Modal, ModalTrigger, ModalClose, ModalContent };
