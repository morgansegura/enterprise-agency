import { BlockRenderer } from "@/components/block-renderer";
import type { FooterConfig } from "@/lib/footers/types";
import { cn } from "@/lib/utils";
import "./footer-renderer.css";

type FooterRendererProps = {
  config: FooterConfig;
  className?: string;
};

/**
 * FooterRenderer - Renders footer based on configuration
 *
 * Handles:
 * - Column layouts (1-4 columns)
 * - Footer columns contain RootBlock[] (reuses block system)
 * - Optional bottom bar with left/center/right sections
 * - Background and spacing styling
 */
export function FooterRenderer({ config, className }: FooterRendererProps) {
  const { template, columns, bottomBar, styling } = config;

  return (
    <div
      className={cn("footer-renderer", className)}
      data-background={styling?.background || "dark"}
      data-max-width={styling?.maxWidth || "container"}
    >
      {/* Main footer columns */}
      <div
        className="footer-columns"
        data-template={template}
        data-max-width={styling?.maxWidth || "container"}
        data-spacing={styling?.spacing || "lg"}
      >
        {columns.map((column) => (
          <div
            key={column._key}
            className="footer-column"
            data-width={column.width}
          >
            <BlockRenderer blocks={column.blocks} />
          </div>
        ))}
      </div>

      {/* Optional bottom bar */}
      {bottomBar && (
        <>
          {styling?.divider && <div className="footer-divider" />}
          <div
            className="footer-bottom-bar"
            data-max-width={styling?.maxWidth || "container"}
          >
            {bottomBar.left && (
              <div className="footer-bottom-section" data-align="left">
                <BlockRenderer blocks={bottomBar.left} />
              </div>
            )}

            {bottomBar.center && (
              <div className="footer-bottom-section" data-align="center">
                <BlockRenderer blocks={bottomBar.center} />
              </div>
            )}

            {bottomBar.right && (
              <div className="footer-bottom-section" data-align="right">
                <BlockRenderer blocks={bottomBar.right} />
              </div>
            )}
          </div>
        </>
      )}
    </div>
  );
}
