/**
 * Menu Token Schema
 * Complete token-based menu styling system
 * Reusable across header, footer, sidebar, tabs, etc.
 */

export interface MenuTokens {
  // ==========================================
  // LAYOUT & SPACING
  // ==========================================
  gap: {
    horizontal: string; // Gap between horizontal menu items
    vertical: string; // Gap between vertical menu items
  };

  // ==========================================
  // MENU ITEMS (Links)
  // ==========================================
  item: {
    fontSize: string;
    fontWeight: string;
    lineHeight: string;
    padding: {
      x: string;
      y: string;
    };
    borderRadius: string;
    border: {
      width: string;
      color: {
        default: string;
        hover: string;
        active: string;
      };
    };
  };

  // ==========================================
  // COLORS - Default State
  // ==========================================
  color: {
    default: string;
    hover: string;
    active: string;
  };

  background: {
    default: string;
    hover: string;
    active: string;
  };

  // ==========================================
  // STYLE VARIANTS
  // ==========================================
  variants: {
    // Pills - rounded background
    pills: {
      borderRadius: string;
      background: {
        default: string;
        hover: string;
        active: string;
      };
    };

    // Underline - bottom border
    underline: {
      borderWidth: string;
      borderColor: {
        default: string;
        hover: string;
        active: string;
      };
      offset: string; // Distance from text
    };

    // Bordered - full border
    bordered: {
      borderWidth: string;
      borderColor: {
        default: string;
        hover: string;
        active: string;
      };
    };

    // Minimal - text only, no background
    minimal: {
      padding: {
        x: string;
        y: string;
      };
    };
  };

  // ==========================================
  // DROPDOWN MENUS
  // ==========================================
  dropdown: {
    width: string;
    padding: string;
    gap: string;
    background: string;
    border: {
      width: string;
      color: string;
      radius: string;
    };
    shadow: string;

    // Animation
    animation: {
      duration: string;
      timing: string;
      slideDistance: string;
    };

    // Dropdown items
    item: {
      fontSize: string;
      fontWeight: string;
      padding: {
        x: string;
        y: string;
      };
      borderRadius: string;
      color: {
        default: string;
        hover: string;
      };
      background: {
        default: string;
        hover: string;
      };
    };
  };

  // ==========================================
  // MEGA MENU
  // ==========================================
  megaMenu: {
    width: string;
    maxWidth: string;
    padding: string;
    gap: string;
    background: string;
    border: {
      width: string;
      color: string;
      radius: string;
    };
    shadow: string;

    // Column headings
    heading: {
      fontSize: string;
      fontWeight: string;
      color: string;
      marginBottom: string;
    };

    // Column items
    item: {
      fontSize: string;
      padding: {
        x: string;
        y: string;
      };
    };
  };

  // ==========================================
  // BADGES
  // ==========================================
  badge: {
    fontSize: string;
    fontWeight: string;
    padding: {
      x: string;
      y: string;
    };
    borderRadius: string;
    marginLeft: string;

    // Badge variants
    new: {
      background: string;
      color: string;
    };
    hot: {
      background: string;
      color: string;
    };
    sale: {
      background: string;
      color: string;
    };
  };

  // ==========================================
  // ICONS
  // ==========================================
  icon: {
    size: string;
    marginLeft: string;
    marginRight: string;
    color: {
      default: string;
      hover: string;
    };
  };

  // ==========================================
  // MOBILE MENU (Vertical/Drawer)
  // ==========================================
  mobile: {
    fontSize: string;
    fontWeight: string;
    padding: {
      x: string;
      y: string;
    };
    gap: string;
    borderRadius: string;

    // Mobile submenu
    submenu: {
      indent: string;
      borderLeft: {
        width: string;
        color: string;
      };
      background: string;
    };
  };

  // ==========================================
  // CONTEXT-SPECIFIC OVERRIDES
  // ==========================================
  contexts: {
    // Header context
    header: {
      fontSize?: string;
      fontWeight?: string;
      color?: {
        default?: string;
        hover?: string;
        active?: string;
      };
    };

    // Footer context
    footer: {
      fontSize?: string;
      fontWeight?: string;
      color?: {
        default?: string;
        hover?: string;
        active?: string;
      };
    };

    // Sidebar context
    sidebar: {
      fontSize?: string;
      fontWeight?: string;
      padding?: {
        x?: string;
        y?: string;
      };
    };
  };
}
