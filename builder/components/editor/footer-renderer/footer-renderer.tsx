"use client";

import { useFooter, useDefaultFooter } from "@/lib/hooks/use-footers";
import type { Footer } from "@/lib/hooks/use-footers";
import "./footer-renderer.css";

interface FooterRendererProps {
  tenantId: string;
  footerId?: string | null;
}

export function FooterRenderer({ tenantId, footerId }: FooterRendererProps) {
  const { data: specificFooter, isLoading: specificLoading } = useFooter(
    tenantId,
    footerId && footerId !== "default" ? footerId : "",
  );

  const { data: defaultFooter, isLoading: defaultLoading } =
    useDefaultFooter(tenantId);

  const footer: Footer | null | undefined =
    footerId === "default" || !footerId
      ? defaultFooter
      : specificFooter || defaultFooter;

  const isLoading = specificLoading || defaultLoading;

  if (footerId === "none") return null;

  if (isLoading) {
    return (
      <footer className="builder-footer builder-footer-loading">
        <div className="builder-footer-skeleton" />
      </footer>
    );
  }

  if (!footer) return null;

  return (
    <footer className="builder-footer">
      <div className="builder-footer-container">
        <div className="builder-footer-content">
          <span className="builder-footer-name">{footer.name}</span>
          <span className="builder-footer-layout">{footer.layout}</span>
        </div>
        {footer.copyright?.text && (
          <div className="builder-footer-copyright">
            {footer.copyright.showYear && `© ${new Date().getFullYear()} `}
            {footer.copyright.companyName || footer.copyright.text}
          </div>
        )}
      </div>
    </footer>
  );
}
