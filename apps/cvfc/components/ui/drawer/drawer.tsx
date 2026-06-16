"use client";

import * as React from "react";
import { Dialog as DialogPrimitive } from "@base-ui/react/dialog";

import { cn } from "@/lib/utils";

import "./drawer.css";

const Drawer = DialogPrimitive.Root;
const DrawerTrigger = DialogPrimitive.Trigger;
const DrawerClose = DialogPrimitive.Close;

type DrawerContentProps = Omit<
  React.ComponentProps<typeof DialogPrimitive.Popup>,
  "title"
> & {
  side?: "right" | "left";
  title: string;
  description?: string;
};

function DrawerContent({
  side = "right",
  title,
  description,
  className,
  children,
  ...props
}: DrawerContentProps) {
  return (
    <DialogPrimitive.Portal>
      <DialogPrimitive.Backdrop className="drawer-backdrop" />
      <DialogPrimitive.Popup
        data-side={side}
        data-slot="drawer"
        className={cn("drawer", `drawer-${side}`, className)}
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

export { Drawer, DrawerTrigger, DrawerClose, DrawerContent };
