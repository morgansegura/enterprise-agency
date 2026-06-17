"use client";

import * as React from "react";
import Link from "next/link";

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
} from "@/components/ui";
import { Icon } from "@/components/icon";
import { HEADER_NAV, type TMenuItem } from "@/lib/menu";
import { cn } from "@/lib/utils";

import "./mobile-nav.css";

type MobileNavProps = {
  className?: string;
  items?: TMenuItem[];
};

export function MobileNav({ className, items = HEADER_NAV }: MobileNavProps) {
  const [open, setOpen] = React.useState(false);

  return (
    <div className={cn("mobile-nav-root", className)}>
      <Drawer open={open} onOpenChange={setOpen}>
        <DrawerTrigger
          className="mobile-nav-trigger"
          aria-label="Open navigation menu"
        >
          <Icon token="ri:bars" className="mobile-nav-trigger-icon" />
        </DrawerTrigger>

        <DrawerContent side="right" title="Site navigation">
          <div className="mobile-nav-header">
            <DrawerClose
              className="mobile-nav-close"
              aria-label="Close navigation menu"
            >
              <span aria-hidden="true">×</span>
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
                        className="mobile-nav-flat-link"
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
                                <span className="mobile-nav-sub-label">
                                  {sub.label}
                                </span>
                                {sub.description ? (
                                  <span className="mobile-nav-sub-description">
                                    {sub.description}
                                  </span>
                                ) : null}
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

          <div className="mobile-nav-footer">
            <DrawerClose
              nativeButton={false}
              render={
                <Button
                  className="mobile-nav-cta"
                  render={<Link href="/evaluations" />}
                >
                  Evaluations
                </Button>
              }
            />
          </div>
        </DrawerContent>
      </Drawer>
    </div>
  );
}
