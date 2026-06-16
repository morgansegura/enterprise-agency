import type React from "react";

// Custom (SVGR or hand‑rolled)
// import Trophy from "./trophy.svg";
// import Users from "./users.svg";
// import Shield from "./shield.svg";

// Lucide
// import { AlarmClock, Trophy as LucideTrophy } from "lucide-react";

// React‑Icons (example: Feather subset)
import {
  FaArrowRightLong,
  FaAngleDown,
  FaBars,
  FaFacebook,
  FaInstagram,
  FaClipboardList,
} from "react-icons/fa6";
import { PiSoccerBallFill } from "react-icons/pi";
import { MdOutlineBadge } from "react-icons/md";
import { CUSTOM_ICONS } from "./icons.registry";

export type IconComponent = React.ComponentType<React.SVGProps<SVGSVGElement>>;
export type CustomIconName = keyof typeof CUSTOM_ICONS;

export const LUCIDE_ICONS = {
  // alarmClock: AlarmClock,
  // trophy: LucideTrophy,
} as const satisfies Record<string, IconComponent>;
export type LucideIconName = keyof typeof LUCIDE_ICONS;

export const REACT_ICONS = {
  "arrow-right": FaArrowRightLong,
  "soccer-ball": PiSoccerBallFill,
  "angle-down": FaAngleDown,
  "clipboard-list": FaClipboardList,
  instagram: FaInstagram,
  facebook: FaFacebook,
  bars: FaBars,
  badge: MdOutlineBadge,
} as const satisfies Record<string, IconComponent>;
export type ReactIconName = keyof typeof REACT_ICONS;
