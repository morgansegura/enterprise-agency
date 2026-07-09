"use client";

import * as React from "react";
import Link from "next/link";
import { Menu, X } from "lucide-react";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
  Button,
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerTrigger,
  type TMenuItem,
} from "@wf/ui";

import { HEADER_ACTIONS, HEADER_NAV } from "@/lib/menu";
import { cn } from "@/lib/utils";

import "./mobile-nav.css";

type MobileNavProps = {
  className?: string;
  items?: TMenuItem[];
};

/** Mobile navigation — hamburger opens a right-side drawer with accordion nav. */
export function MobileNav({ className, items = HEADER_NAV }: MobileNavProps) {
  const [open, setOpen] = React.useState(false);

  return (
    <div className={cn("mobile-nav", className)}>
      <Drawer open={open} onOpenChange={setOpen}>
        <DrawerTrigger
          className="mobile-nav-trigger"
          aria-label="Open navigation menu"
        >
          <Menu className="mobile-nav-trigger-icon" aria-hidden="true" />
        </DrawerTrigger>

        <DrawerContent side="right" title="Site navigation">
          <div className="mobile-nav-head">
            <DrawerClose
              className="mobile-nav-close"
              aria-label="Close navigation menu"
            >
              <X aria-hidden="true" />
            </DrawerClose>
          </div>

          <Accordion type="single" collapsible className="mobile-nav-accordion">
            {items.map((item) => {
              const hasChildren = !!item.items?.length;
              if (!hasChildren) {
                return (
                  <DrawerClose
                    key={item.label}
                    nativeButton={false}
                    render={
                      <Link
                        href={item.href ?? "#"}
                        target={item.target || undefined}
                        className="mobile-nav-link"
                      >
                        {item.label}
                      </Link>
                    }
                  />
                );
              }
              return (
                <AccordionItem key={item.label} value={item.label ?? ""}>
                  <AccordionTrigger>{item.label}</AccordionTrigger>
                  <AccordionContent>
                    <ul className="mobile-nav-sub">
                      {item.items?.map((sub) => (
                        <li key={sub.label}>
                          <DrawerClose
                            nativeButton={false}
                            render={
                              <Link
                                href={sub.href ?? "#"}
                                target={sub.target || undefined}
                                className="mobile-nav-sub-link"
                              >
                                {sub.label}
                              </Link>
                            }
                          />
                        </li>
                      ))}
                    </ul>
                  </AccordionContent>
                </AccordionItem>
              );
            })}
          </Accordion>

          <div className="mobile-nav-foot">
            {HEADER_ACTIONS.map((action) => (
              <DrawerClose
                key={action.label}
                nativeButton={false}
                render={
                  <Button
                    variant={
                      action.variant === "outline" ? "outline" : "default"
                    }
                    className="mobile-nav-cta"
                    render={<Link href={action.href} />}
                  >
                    {action.label}
                  </Button>
                }
              />
            ))}
          </div>
        </DrawerContent>
      </Drawer>
    </div>
  );
}
