import * as React from "react";

import { cn } from "@/lib/utils";

import { CUSTOM_ICONS } from "./icons.registry";
import { LUCIDE_ICONS, REACT_ICONS } from "./registry";
import type {
  CustomIconName,
  IconComponent,
  LucideIconName,
  ReactIconName,
} from "./registry";

type Namespace = "ri" | "lu" | "custom";

type IconToken =
  | `ri:${ReactIconName}`
  | `lu:${LucideIconName}`
  | `custom:${CustomIconName}`;

type IconProps = Omit<React.SVGProps<SVGSVGElement>, "ref"> & {
  token: IconToken;
};

const REGISTRIES: Record<Namespace, Record<string, IconComponent>> = {
  ri: REACT_ICONS,
  lu: LUCIDE_ICONS,
  custom: CUSTOM_ICONS,
};

export function Icon({ token, className, ...props }: IconProps) {
  const [ns, name] = token.split(":") as [Namespace, string];
  const registry = REGISTRIES[ns];
  const Component = registry?.[name];

  if (!Component) {
    if (process.env.NODE_ENV !== "production") {
      console.warn(`[Icon] unknown token: "${token}"`);
    }
    return null;
  }

  return <Component aria-hidden="true" className={cn(className)} {...props} />;
}
