import { BlockRenderer } from "@/components/block-renderer";
import type { FooterConfig } from "@/lib/footers/types";
import { cn } from "@/lib/utils";
import "@/styles/tokens/footer.css";

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
    <footer
      className={cn("footer-renderer", className)}
      data-template={template}
      data-max-width={styling?.maxWidth || "container"}
    >
      {/* Main footer container */}
      <div className="footer-container">
        {/* Footer columns/sections */}
        <div className="footer-sections">
          {columns.map((column) => (
            <div key={column._key} className="footer-section">
              <BlockRenderer blocks={column.blocks} />
            </div>
          ))}
        </div>
      </div>

      {/* Optional bottom bar */}
      {bottomBar && (
        <div className="footer-bottom-bar">
          <div className="footer-bottom-bar-container">
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
        </div>
      )}
    </footer>
  );
}
