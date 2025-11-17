import type { LogoConfig } from "@/lib/logos/types";

/**
 * Logo Mocks
 * Example logos for development
 */

/**
 * Primary SVG Logo
 * Simple church logo with text
 */
export const primaryLogoMock: LogoConfig = {
  type: "svg",
  svg: `<svg viewBox="0 0 200 60" fill="none" xmlns="http://www.w3.org/2000/svg">
    <!-- Church icon -->
    <path d="M30 10 L35 5 L40 10 L40 50 L20 50 L20 10 Z" fill="currentColor"/>
    <rect x="28" y="40" width="4" height="10" fill="white"/>
    <rect x="25" y="30" width="3" height="4" fill="white"/>
    <rect x="32" y="30" width="3" height="4" fill="white"/>
    <path d="M35 5 L35 2 L32 2 L32 0 L38 0 L38 2 L35 2 Z" fill="currentColor"/>
    <!-- Text -->
    <text x="50" y="35" font-family="Arial, sans-serif" font-size="18" font-weight="700" fill="currentColor">
      MH Bible Baptist
    </text>
  </svg>`,
  svgDark: `<svg viewBox="0 0 200 60" fill="none" xmlns="http://www.w3.org/2000/svg">
    <!-- Church icon -->
    <path d="M30 10 L35 5 L40 10 L40 50 L20 50 L20 10 Z" fill="white"/>
    <rect x="28" y="40" width="4" height="10" fill="#1a1a1a"/>
    <rect x="25" y="30" width="3" height="4" fill="#1a1a1a"/>
    <rect x="32" y="30" width="3" height="4" fill="#1a1a1a"/>
    <path d="M35 5 L35 2 L32 2 L32 0 L38 0 L38 2 L35 2 Z" fill="white"/>
    <!-- Text -->
    <text x="50" y="35" font-family="Arial, sans-serif" font-size="18" font-weight="700" fill="white">
      MH Bible Baptist
    </text>
  </svg>`,
  alt: "MH Bible Baptist Church",
  width: "200px",
  height: "60px",
  link: "/",
};

/**
 * Secondary Logo (Icon Only)
 * Just the church icon, no text
 */
export const iconLogoMock: LogoConfig = {
  type: "svg",
  svg: `<svg viewBox="0 0 60 60" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M30 10 L35 5 L40 10 L40 50 L20 50 L20 10 Z" fill="currentColor"/>
    <rect x="28" y="40" width="4" height="10" fill="white"/>
    <rect x="25" y="30" width="3" height="4" fill="white"/>
    <rect x="32" y="30" width="3" height="4" fill="white"/>
    <path d="M35 5 L35 2 L32 2 L32 0 L38 0 L38 2 L35 2 Z" fill="currentColor"/>
  </svg>`,
  alt: "MH Bible Baptist Church Icon",
  width: "60px",
  height: "60px",
  link: "/",
};

/**
 * Image Logo Example
 * For comparison - most users will use SVG but we support images too
 */
export const imageLogoMock: LogoConfig = {
  type: "image",
  src: "/logo.png",
  srcDark: "/logo-dark.png",
  alt: "MH Bible Baptist Church",
  width: 180,
  height: 60,
  link: "/",
};
