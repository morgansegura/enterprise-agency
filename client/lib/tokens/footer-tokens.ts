/**
 * Footer Token Schema
 * Complete token-based footer styling system
 */

export interface FooterTokens {
  // ==========================================
  // LAYOUT & STRUCTURE
  // ==========================================
  padding: {
    x: {
      default: string;
      mobile: string;
    };
    y: {
      default: string;
      mobile: string;
    };
  };

  gap: {
    sections: string; // Gap between footer sections/columns
    mobile: string;
  };

  maxWidth: {
    narrow: string; // 768px
    container: string; // 1280px
    full: string; // 100%
  };

  // ==========================================
  // VISUAL STYLING
  // ==========================================
  background: {
    default: string;
    secondary: string; // For bottom bar/copyright section
  };

  border: {
    width: string;
    color: {
      default: string;
      top: string; // Top border
    };
  };

  // ==========================================
  // SECTIONS & COLUMNS
  // ==========================================
  section: {
    padding: {
      y: string;
    };
    gap: string; // Gap within a section
  };

  columns: {
    gap: string; // Gap between columns
    minWidth: string; // Minimum column width
  };

  // ==========================================
  // SECTION HEADINGS
  // ==========================================
  heading: {
    fontSize: string;
    fontWeight: string;
    lineHeight: string;
    color: string;
    marginBottom: string;
    textTransform: string; // "none" | "uppercase" | "capitalize"
  };

  // ==========================================
  // LINKS
  // ==========================================
  link: {
    fontSize: string;
    fontWeight: string;
    lineHeight: string;
    color: {
      default: string;
      hover: string;
    };
    textDecoration: {
      default: string;
      hover: string;
    };
  };

  // ==========================================
  // TEXT (Copyright, descriptions)
  // ==========================================
  text: {
    fontSize: string;
    fontWeight: string;
    lineHeight: string;
    color: string;
  };

  // ==========================================
  // SOCIAL LINKS
  // ==========================================
  social: {
    gap: string;
    iconSize: string;
    color: {
      default: string;
      hover: string;
    };
    background: {
      default: string;
      hover: string;
    };
    borderRadius: string;
    padding: string;
  };

  // ==========================================
  // BOTTOM BAR (Copyright section)
  // ==========================================
  bottomBar: {
    padding: {
      y: string;
    };
    fontSize: string;
    fontWeight: string;
    color: string;
    background: string;
    borderTop: {
      width: string;
      color: string;
    };
  };

  // ==========================================
  // CTA SECTION (Newsletter, etc.)
  // ==========================================
  cta: {
    padding: {
      y: string;
    };
    background: string;
    borderRadius: string;
    title: {
      fontSize: string;
      fontWeight: string;
      color: string;
      marginBottom: string;
    };
    description: {
      fontSize: string;
      color: string;
      marginBottom: string;
    };
  };

  // ==========================================
  // TEMPLATE VARIATIONS
  // ==========================================
  templates: {
    // Centered footer (logo + links centered)
    centered: {
      logoMarginBottom: string;
      textAlign: string;
    };

    // Stacked footer (sections stacked vertically)
    stacked: {
      sectionGap: string;
    };

    // Minimal footer (single row)
    minimal: {
      padding: {
        y: string;
      };
    };
  };
}
