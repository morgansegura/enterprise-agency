import { Inter } from "next/font/google";

/** Base font, exposed as the `--font-base` CSS var (consumed in globals.css).
 *  Swap or add a heading font per site. */
export const fontBase = Inter({
  subsets: ["latin"],
  variable: "--font-base",
  display: "swap",
});
