import { cn } from "@/lib/utils";

import "./logo.css";

export function Logo({ className }: { className?: string }) {
  return (
    <svg
      className={cn("logo", className)}
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 325.78 326.22"
    >
      <g id="square">
        <rect className="color-1" width="325.78" height="326.22" />
      </g>
      <g id="Layer_4" data-name="Layer 4">
        <polygon
          className="color-2"
          points="115.32 209.39 115.32 46.22 46.22 46.22 46.22 144.9 115.22 209.33 46.22 209.28 46.22 209.39 46.22 280.18 46.22 280.53 115.32 280.53 115.32 280.18 115.5 280.18 115.39 209.5 182.58 280.18 280.73 280.18 280.73 209.39 115.32 209.39"
        />
      </g>
    </svg>
  );
}
