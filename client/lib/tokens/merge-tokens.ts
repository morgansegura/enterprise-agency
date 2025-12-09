import type { HeaderTokens } from "./header-tokens";
import type { MenuTokens } from "./menu-tokens";
import type { FooterTokens } from "./footer-tokens";
import type { SectionTokens } from "./section-tokens";
import { headerDefaults } from "./header-defaults";
import { menuDefaults } from "./menu-defaults";
import { footerDefaults } from "./footer-defaults";
import { sectionDefaults } from "./section-defaults";

/**
 * Tenant Token Overrides Structure
 */
export interface TenantTokens {
  header?: Partial<HeaderTokens>;
  menu?: Partial<MenuTokens>;
  footer?: Partial<FooterTokens>;
  section?: Partial<SectionTokens>;
}

/**
 * Merged Token Structure
 */
export interface MergedTokens {
  header: HeaderTokens;
  menu: MenuTokens;
  footer: FooterTokens;
  section: SectionTokens;
}

/**
 * Deep merge utility
 * Recursively merges override object into base object
 * Preserves nested structures and only overrides provided values
 */
function deepMerge<T>(base: T, override: Partial<T>): T {
  const result = { ...base } as T;

  for (const key in override) {
    const overrideValue = override[key];
    const baseValue = result[key];

    if (overrideValue === undefined) {
      continue;
    }

    // If both are objects (but not arrays), recursively merge
    if (
      isPlainObject(baseValue) &&
      isPlainObject(overrideValue) &&
      !Array.isArray(baseValue) &&
      !Array.isArray(overrideValue)
    ) {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      result[key] = deepMerge(baseValue as any, overrideValue as any) as any;
    } else {
      // Otherwise, override completely
      result[key] = overrideValue as T[Extract<keyof T, string>];
    }
  }

  return result;
}

/**
 * Type guard for plain objects
 */
function isPlainObject(value: unknown): value is Record<string, unknown> {
  return (
    typeof value === "object" &&
    value !== null &&
    Object.prototype.toString.call(value) === "[object Object]"
  );
}

/**
 * Merge Tenant Token Overrides with Platform Defaults
 *
 * Strategy:
 * - Start with platform defaults (complete token sets)
 * - Deep merge tenant overrides on top
 * - Tenant only needs to override specific properties
 * - Missing properties fall back to platform defaults
 *
 * Example:
 * ```ts
 * const tenantTokens = {
 *   header: {
 *     height: { desktop: "80px" }
 *   }
 * };
 *
 * const merged = mergeTokens(tenantTokens);
 * // merged.header.height.desktop = "80px" (overridden)
 * // merged.header.height.mobile = "60px" (from defaults)
 * // merged.header.colors.* = defaults (all default colors)
 * ```
 *
 * @param tenantOverrides - Partial token overrides from tenant
 * @returns Complete token set with overrides applied
 */
export function mergeTokens(tenantOverrides: TenantTokens = {}): MergedTokens {
  return {
    header: deepMerge(headerDefaults, tenantOverrides.header || {}),
    menu: deepMerge(menuDefaults, tenantOverrides.menu || {}),
    footer: deepMerge(footerDefaults, tenantOverrides.footer || {}),
    section: deepMerge(sectionDefaults, tenantOverrides.section || {}),
  };
}
