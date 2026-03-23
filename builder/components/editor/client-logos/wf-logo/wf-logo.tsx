import { cn } from "@enterprise/tokens";
import "./wf-logo.css";

type LogoProps = {
  className?: string;
  size?: "sm" | "base" | "lg";
  variant?: "light" | "dark";
};

export function WFLogoIcon({
  className,
  size = "sm",
  variant = "dark",
}: LogoProps) {
  return (
    <svg
      id="WF-Logo"
      data-name="WF-Logo"
      xmlns="http://www.w3.org/2000/svg"
      xmlnsXlink="http://www.w3.org/1999/xlink"
      viewBox="0 0 372.46 370.04"
      className={cn("wf-logo", className)}
      data-logo-size={size}
      data-logo-variant={variant}
    >
      <defs>
        <linearGradient
          id="linear-gradient"
          x1="155.81"
          y1="244.05"
          x2="308.44"
          y2="55.56"
          gradientTransform="translate(0 372) scale(1 -1)"
          gradientUnits="userSpaceOnUse"
        >
          <stop offset="0" stopColor="#fff" />
          <stop offset=".17" stopColor="#c7d9e2" />
          <stop offset=".59" stopColor="#4f6a82" />
          <stop offset="1" stopColor="#46637c" />
        </linearGradient>
      </defs>
      <g id="Layer_10" data-name="Layer 10">
        <path
          className="color-6"
          d="M356.49,249.28c-37.69,91.34-144.35,135.46-238.23,98.55C24.37,310.92-21.18,206.95,16.51,115.61,54.2,24.27,160.86-19.85,254.74,17.06c93.88,36.91,139.44,140.88,101.75,232.22Z"
        />
      </g>
      <g id="Layer_4" data-name="Layer 4">
        <path
          className="color-2"
          d="M14.53,142.57C39.31,48.86,137.2-7.5,233.17,16.68c95.97,24.18,153.68,119.76,128.9,213.47-7.74,29.26-22.6,54.88-42.31,75.54,22-21.65,38.55-49.03,46.89-80.57,25.38-95.96-34.83-194.11-134.47-219.22C132.53-19.22,31.18,38.22,5.8,134.18c-20.36,76.98,14.37,155.36,80.34,196.32C26.07,289.91-4.81,215.67,14.53,142.57Z"
        />
        <path
          className="color-2"
          d="M109.19,17.87s-20.39-5.25-41.35,17.14c0,0-12.46-6.64-28.33,8.02,0,0,13.6-1.11,17.56,3.87l-3.4,9.12,55.52-38.16h0Z"
        />
        <path
          className="color-2"
          d="M112.09,20.76s-.64,20.58-28.6,33.82c0,0,2.97,13.55-15.93,24.23,0,0,4.95-12.41,1.19-17.54l-9.93.59s53.27-41.1,53.27-41.1Z"
        />
      </g>
      <g id="Layer_3" data-name="Layer 3">
        <path
          className="color-2"
          d="M244.52,352.36l-9.3,14.86c-1.76,2.81-5.46,3.66-8.27,1.91l-128.67-80.48,12.48-19.95c1.76-2.81,5.46-3.66,8.27-1.91l123.59,77.29c2.81,1.76,3.66,5.46,1.91,8.27h0Z"
        />
        <g>
          <circle className="color-4" cx="232.12" cy="222.19" r="117.26" />
          <path
            className="color-3"
            d="M232.12,104.93c64.76,0,117.26,52.5,117.26,117.26s-52.5,117.26-117.26,117.26-117.26-52.5-117.26-117.26,52.5-117.26,117.26-117.26M232.12,100.93c-32.39,0-62.84,12.61-85.74,35.52-22.9,22.9-35.52,53.35-35.52,85.74s12.61,62.84,35.52,85.74c22.9,22.9,53.35,35.52,85.74,35.52s62.84-12.61,85.74-35.52c22.9-22.9,35.52-53.35,35.52-85.74s-12.61-62.84-35.52-85.74c-22.9-22.9-53.35-35.52-85.74-35.52h0Z"
          />
        </g>
      </g>
      <g id="Layer_9" data-name="Layer 9">
        <ellipse
          className="color-1"
          cx="224.51"
          cy="219.98"
          rx="109.62"
          ry="66.84"
          transform="translate(-88.08 252.91) rotate(-50.43)"
        />
      </g>
      <g id="Layer_7" data-name="Layer 7">
        <path
          className="color-5"
          d="M227.21,123.49s-16.56,14.56-30.92,1.7c14.36,12.86,1.7,30.92,1.7,30.92,0,0,16.56-14.56,30.92-1.7-14.36-12.86-1.7-30.92-1.7-30.92Z"
        />
      </g>
      <g id="Layer_5" data-name="Layer 5">
        <path
          className="color-2"
          d="M257.09,107.58c-.06-.01-.11-.02-.17-.03,28.37,22.44,43.06,60.76,34.6,99.65-11.67,53.68-63.01,88.09-114.66,76.86-26.41-5.74-47.77-22.33-60.8-44.33,7.06,46.77,42.17,86.56,91.15,97.21,63.35,13.78,125.88-26.39,139.65-89.73s-26.42-125.85-89.77-139.63h0Z"
        />
      </g>
      <g id="Layer_2" data-name="Layer 2">
        <circle className="color-2" cx="267.52" cy="243.92" r="33.13" />
        <circle className="color-5" cx="267.52" cy="243.92" r="22.47" />
        <circle className="color-2" cx="267.52" cy="243.92" r="11.56" />
      </g>
    </svg>
  );
}
