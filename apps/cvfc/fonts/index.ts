import { Geist, Google_Sans_Flex } from "next/font/google";

export const fontBase = Geist({
  variable: "--font-base",
  subsets: ["latin"],
  display: "swap",
  preload: true,
});

export const fontHeading = Google_Sans_Flex({
  variable: "--font-heading",
  subsets: ["latin"],
  weight: ["500", "600", "700"],
  display: "swap",
  preload: true,
});
