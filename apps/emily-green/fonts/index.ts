import { Lora, Instrument_Sans } from "next/font/google";

/** Base font, exposed as the `--font-base` CSS var (consumed in globals.css).
 *  Swap or add a heading font per site. */
export const fontBase = Instrument_Sans({
  subsets: ["latin"],
  variable: "--font-base",
  display: "swap",
});
export const fontHeading = Lora({
  subsets: ["latin"],
  variable: "--font-heading",
  display: "swap",
});
