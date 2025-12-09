import { Logo } from "@/components/logo";
import type { LogoConfig, LogoSize } from "@/lib/logos/types";
import { cn } from "@/lib/utils";
import { logger } from "@/lib/logger";
import "./logo-block.css";

type LogoBlockProps = {
  block: {
    _type: "logo-block";
    _key: string;
    logo: string; // Logo ID reference
    size?: string;
    alignment?: string;
    clickable?: boolean;
  };
  logos?: Record<string, LogoConfig>; // Logo registry from SiteConfig
};

/**
 * LogoBlock - Logo as a content block
 * Can be dropped anywhere in the block editor (footer, privacy page, etc.)
 */
export function LogoBlock({ block, logos = {} }: LogoBlockProps) {
  // Resolve logo config from registry
  const logoConfig = logos[block.logo];

  if (!logoConfig) {
    logger.warn(`Logo "${block.logo}" not found in registry`);
    return null;
  }

  return (
    <div
      className={cn("logo-block")}
      data-alignment={block.alignment || "left"}
    >
      <Logo
        config={logoConfig}
        size={(block.size as LogoSize) || "md"}
        clickable={block.clickable !== false}
      />
    </div>
  );
}
