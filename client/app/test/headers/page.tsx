"use client";

import { useState } from "react";
import { HeaderRenderer } from "@/components/header-renderer";
import type { HeaderConfig } from "@/lib/headers/types";
import type { Menu } from "@/lib/menus/types";
import type { LogoConfig } from "@/lib/logos/types";
import { generateHeaderCSS } from "@/lib/tokens/generate-header-css";
import { headerDefaults } from "@/lib/tokens/header-defaults";
import { generateMenuCSS } from "@/lib/tokens/generate-menu-css";
import { menuDefaults } from "@/lib/tokens/menu-defaults";

const masterLogo = `<?xml version="1.0" encoding="UTF-8"?>
<svg id="Layer_1" data-name="Layer 1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" viewBox="0 0 372.46 370.04">
  <defs>
    <style>
      .cls-1 {
        isolation: isolate;
        opacity: .08;
      }

      .cls-1, .cls-2 {
        fill: #45637c;
      }

      .cls-3 {
        fill: url(#linear-gradient);
      }

      .cls-4 {
        fill: #dce8ed;
      }

      .cls-5 {
        fill: #fff;
      }

      .cls-6 {
        fill: #d9e7ed;
      }
    </style>
    <linearGradient id="linear-gradient" x1="155.81" y1="244.05" x2="308.44" y2="55.56" gradientTransform="translate(0 372) scale(1 -1)" gradientUnits="userSpaceOnUse">
      <stop offset="0" stop-color="#fff"/>
      <stop offset=".17" stop-color="#c7d9e2"/>
      <stop offset=".59" stop-color="#4f6a82"/>
      <stop offset="1" stop-color="#46637c"/>
    </linearGradient>
  </defs>
  <g id="Layer_10" data-name="Layer 10">
    <path class="cls-6" d="M356.49,249.28c-37.69,91.34-144.35,135.46-238.23,98.55C24.37,310.92-21.18,206.95,16.51,115.61,54.2,24.27,160.86-19.85,254.74,17.06c93.88,36.91,139.44,140.88,101.75,232.22Z"/>
  </g>
  <g id="Layer_4" data-name="Layer 4">
    <path class="cls-2" d="M14.53,142.57C39.31,48.86,137.2-7.5,233.17,16.68c95.97,24.18,153.68,119.76,128.9,213.47-7.74,29.26-22.6,54.88-42.31,75.54,22-21.65,38.55-49.03,46.89-80.57,25.38-95.96-34.83-194.11-134.47-219.22C132.53-19.22,31.18,38.22,5.8,134.18c-20.36,76.98,14.37,155.36,80.34,196.32C26.07,289.91-4.81,215.67,14.53,142.57Z"/>
    <path class="cls-2" d="M109.19,17.87s-20.39-5.25-41.35,17.14c0,0-12.46-6.64-28.33,8.02,0,0,13.6-1.11,17.56,3.87l-3.4,9.12,55.52-38.16h0Z"/>
    <path class="cls-2" d="M112.09,20.76s-.64,20.58-28.6,33.82c0,0,2.97,13.55-15.93,24.23,0,0,4.95-12.41,1.19-17.54l-9.93.59s53.27-41.1,53.27-41.1Z"/>
  </g>
  <g id="Layer_3" data-name="Layer 3">
    <path class="cls-2" d="M244.52,352.36l-9.3,14.86c-1.76,2.81-5.46,3.66-8.27,1.91l-128.67-80.48,12.48-19.95c1.76-2.81,5.46-3.66,8.27-1.91l123.59,77.29c2.81,1.76,3.66,5.46,1.91,8.27h0Z"/>
    <g>
      <circle class="cls-4" cx="232.12" cy="222.19" r="117.26"/>
      <path class="cls-3" d="M232.12,104.93c64.76,0,117.26,52.5,117.26,117.26s-52.5,117.26-117.26,117.26-117.26-52.5-117.26-117.26,52.5-117.26,117.26-117.26M232.12,100.93c-32.39,0-62.84,12.61-85.74,35.52-22.9,22.9-35.52,53.35-35.52,85.74s12.61,62.84,35.52,85.74c22.9,22.9,53.35,35.52,85.74,35.52s62.84-12.61,85.74-35.52c22.9-22.9,35.52-53.35,35.52-85.74s-12.61-62.84-35.52-85.74c-22.9-22.9-53.35-35.52-85.74-35.52h0Z"/>
    </g>
  </g>
  <g id="Layer_9" data-name="Layer 9">
    <ellipse class="cls-1" cx="224.51" cy="219.98" rx="109.62" ry="66.84" transform="translate(-88.08 252.91) rotate(-50.43)"/>
  </g>
  <g id="Layer_7" data-name="Layer 7">
    <path class="cls-5" d="M227.21,123.49s-16.56,14.56-30.92,1.7c14.36,12.86,1.7,30.92,1.7,30.92,0,0,16.56-14.56,30.92-1.7-14.36-12.86-1.7-30.92-1.7-30.92Z"/>
  </g>
  <g id="Layer_5" data-name="Layer 5">
    <path class="cls-2" d="M257.09,107.58c-.06-.01-.11-.02-.17-.03,28.37,22.44,43.06,60.76,34.6,99.65-11.67,53.68-63.01,88.09-114.66,76.86-26.41-5.74-47.77-22.33-60.8-44.33,7.06,46.77,42.17,86.56,91.15,97.21,63.35,13.78,125.88-26.39,139.65-89.73s-26.42-125.85-89.77-139.63h0Z"/>
  </g>
  <g id="Layer_2" data-name="Layer 2">
    <circle class="cls-2" cx="267.52" cy="243.92" r="33.13"/>
    <circle class="cls-5" cx="267.52" cy="243.92" r="22.47"/>
    <circle class="cls-2" cx="267.52" cy="243.92" r="11.56"/>
  </g>
</svg>`;

// Sample logo configuration
const logos: Record<string, LogoConfig> = {
  main: {
    type: "svg",
    svg: masterLogo,
    alt: "Company Logo",
    width: "180px",
    height: "40px",
  },
};

// Sample menu
const sampleMenu: Menu = {
  id: "main",
  name: "Main Navigation",
  slug: "main",
  items: [
    {
      id: "1",
      label: "Home",
      type: "page",
      url: "/",
      order: 1,
      openInNewTab: false,
      isActive: true,
    },
    {
      id: "2",
      label: "About",
      type: "page",
      url: "/about",
      order: 2,
      openInNewTab: false,
      children: [
        {
          id: "2-1",
          label: "Our Team",
          type: "page",
          url: "/about/team",
          order: 1,
          openInNewTab: false,
        },
        {
          id: "2-2",
          label: "Our Story",
          type: "page",
          url: "/about/story",
          order: 2,
          openInNewTab: false,
        },
      ],
    },
    {
      id: "3",
      label: "Services",
      type: "page",
      url: "/services",
      order: 3,
      openInNewTab: false,
      badge: {
        text: "New",
        variant: "new",
      },
    },
    {
      id: "4",
      label: "Blog",
      type: "page",
      url: "/blog",
      order: 4,
      openInNewTab: false,
    },
    {
      id: "5",
      label: "Contact",
      type: "page",
      url: "/contact",
      order: 5,
      openInNewTab: false,
    },
  ],
};

// Header configurations for different variations
const headerVariations: Array<{
  title: string;
  description: string;
  config: HeaderConfig;
  containerClass?: string;
}> = [
  {
    title: "1. Standard Header - Static",
    description: "Default header with standard layout, static positioning",
    config: {
      template: "standard",
      behavior: {
        position: "static",
        transparent: false,
      },
      logo: "main",
      navigation: {
        menuId: "main",
        style: "horizontal",
        variant: "default",
        dropdownTrigger: "hover",
      },
      actions: {
        items: [
          { type: "search", data: { action: "/search" } },
          { type: "theme-toggle", data: {} },
          {
            type: "button",
            data: { text: "Get Started", url: "/signup", variant: "default" },
          },
        ],
      },
      mobile: {
        breakpoint: "lg",
        type: "drawer",
        drawerSide: "left",
        menuId: "main",
      },
    },
  },
  {
    title: "2. Sticky Header - Shrink on Scroll",
    description: "Sticky header that shrinks when scrolling down",
    config: {
      template: "standard",
      behavior: {
        position: "sticky",
        shrinkOnScroll: true,
        showShadowOnScroll: true,
        transparent: false,
      },
      logo: "main",
      navigation: {
        menuId: "main",
        style: "horizontal",
        variant: "default",
        dropdownTrigger: "hover",
      },
      actions: {
        items: [
          { type: "cart", data: { showCount: true } },
          { type: "account", data: { showAvatar: false } },
        ],
      },
      mobile: {
        breakpoint: "lg",
        type: "drawer",
        drawerSide: "right",
        menuId: "main",
      },
    },
    containerClass: "h-[600px]", // Scrollable container to test shrink behavior
  },
  {
    title: "3. Transparent Header → Solid on Scroll",
    description:
      "Transparent initially, becomes solid with border when scrolled",
    config: {
      template: "standard",
      behavior: {
        position: "sticky",
        transparent: true,
        transparentUntilScroll: true,
        showBorderOnScroll: true,
        showShadowOnScroll: true,
      },
      logo: "main",
      navigation: {
        menuId: "main",
        style: "horizontal",
        variant: "default",
        dropdownTrigger: "hover",
      },
      actions: {
        items: [
          {
            type: "button",
            data: { text: "Sign In", url: "/login", variant: "outline" },
          },
          {
            type: "button",
            data: { text: "Sign Up", url: "/signup", variant: "default" },
          },
        ],
      },
      mobile: {
        breakpoint: "lg",
        type: "drawer",
        drawerSide: "right",
        menuId: "main",
      },
      styling: {
        maxWidth: "container",
      },
    },
    containerClass: "h-[600px] bg-gradient-to-b from-blue-50 to-white",
  },
  {
    title: "4. Hide on Scroll Down / Show on Scroll Up",
    description: "Header hides when scrolling down, shows when scrolling up",
    config: {
      template: "standard",
      behavior: {
        position: "sticky",
        hideOnScrollDown: true,
        showOnScrollUp: true,
        shrinkOnScroll: true,
        showShadowOnScroll: true,
        transparent: false,
      },
      logo: "main",
      navigation: {
        menuId: "main",
        style: "horizontal",
        variant: "default",
        dropdownTrigger: "hover",
      },
      actions: {
        items: [
          { type: "search", data: { action: "/search" } },
          {
            type: "button",
            data: { text: "Contact", url: "/contact" },
          },
        ],
      },
      mobile: {
        breakpoint: "lg",
        type: "drawer",
        drawerSide: "left",
        menuId: "main",
      },
    },
    containerClass: "h-[600px]",
  },
  {
    title: "5. Centered Template",
    description: "Logo centered, navigation below",
    config: {
      template: "centered",
      behavior: {
        position: "static",
        transparent: false,
      },
      logo: "main",
      navigation: {
        menuId: "main",
        style: "horizontal",
        variant: "default",
        dropdownTrigger: "hover",
      },
      actions: {
        items: [
          { type: "search", data: { action: "/search" } },
          {
            type: "button",
            data: { text: "Get Started", url: "/signup" },
          },
        ],
      },
      mobile: {
        breakpoint: "lg",
        type: "drawer",
        drawerSide: "left",
        menuId: "main",
      },
    },
  },
  {
    title: "6. Split Template",
    description: "Logo left, nav center, actions right",
    config: {
      template: "split",
      behavior: {
        position: "sticky",
        showShadowOnScroll: true,
        transparent: false,
      },
      logo: "main",
      navigation: {
        menuId: "main",
        style: "horizontal",
        variant: "pills",
        dropdownTrigger: "hover",
      },
      actions: {
        items: [
          { type: "search", data: { action: "/search" } },
          { type: "cart", data: { showCount: true } },
          { type: "account", data: { showAvatar: true } },
        ],
      },
      mobile: {
        breakpoint: "lg",
        type: "drawer",
        drawerSide: "right",
        menuId: "main",
      },
      styling: {
        maxWidth: "full",
      },
    },
  },
  {
    title: "7. Minimal Template",
    description: "Just logo and hamburger menu",
    config: {
      template: "minimal",
      behavior: {
        position: "sticky",
        transparent: false,
      },
      logo: "main",
      navigation: {
        menuId: "main",
        style: "horizontal",
        variant: "minimal",
        dropdownTrigger: "hover",
      },
      mobile: {
        breakpoint: "lg",
        type: "drawer",
        drawerSide: "left",
        menuId: "main",
      },
      styling: {
        maxWidth: "narrow",
      },
    },
  },
];

type ViewportSize = "desktop" | "tablet" | "mobile";

export default function HeaderTestPage() {
  // Generate CSS from tokens
  const headerCSS = generateHeaderCSS(headerDefaults);
  const menuCSS = generateMenuCSS(menuDefaults);
  const tokenCSS = `${headerCSS}\n${menuCSS}`;

  const [viewport, setViewport] = useState<ViewportSize>("desktop");

  const viewportWidths = {
    desktop: "100%",
    tablet: "768px",
    mobile: "375px",
  };

  return (
    <>
      {/* Inject token-based CSS */}
      <style dangerouslySetInnerHTML={{ __html: tokenCSS }} />

      <div className="min-h-screen bg-gray-50">
        {/* Page Header */}
        <div className="bg-white border-b border-gray-200 px-8 py-12">
          <div className="max-w-7xl mx-auto">
            <h1 className="text-4xl font-bold text-gray-900 mb-4">
              Header Variations Test Page
            </h1>
            <p className="text-lg text-gray-600 max-w-3xl">
              Visual testing for all header variations with token-based styling.
              Scroll down to test scroll-based behaviors.
            </p>
            <div className="mt-6 flex flex-wrap gap-6 items-center">
              <div className="flex gap-4 text-sm text-gray-500">
                <div>
                  <span className="font-semibold">Total Variations:</span>{" "}
                  {headerVariations.length}
                </div>
                <div>
                  <span className="font-semibold">Token Variables:</span> ~150
                </div>
              </div>

              {/* Viewport Controls */}
              <div className="flex items-center gap-2">
                <span className="text-sm font-semibold text-gray-700">
                  Viewport:
                </span>
                <div className="flex gap-1 bg-gray-200 rounded-lg p-1">
                  <button
                    onClick={() => setViewport("desktop")}
                    className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
                      viewport === "desktop"
                        ? "bg-white text-gray-900 shadow"
                        : "text-gray-600 hover:text-gray-900"
                    }`}
                  >
                    Desktop
                  </button>
                  <button
                    onClick={() => setViewport("tablet")}
                    className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
                      viewport === "tablet"
                        ? "bg-white text-gray-900 shadow"
                        : "text-gray-600 hover:text-gray-900"
                    }`}
                  >
                    Tablet
                  </button>
                  <button
                    onClick={() => setViewport("mobile")}
                    className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
                      viewport === "mobile"
                        ? "bg-white text-gray-900 shadow"
                        : "text-gray-600 hover:text-gray-900"
                    }`}
                  >
                    Mobile
                  </button>
                </div>
                <span className="text-xs text-gray-500 ml-2">
                  {viewportWidths[viewport]}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Header Variations */}
        <div className="max-w-7xl mx-auto px-8 py-12 space-y-16">
          {headerVariations.map((variation, index) => (
            <div key={index} className="space-y-4">
              {/* Variation Info */}
              <div className="bg-white rounded-lg p-6 border border-gray-200">
                <h2 className="text-2xl font-semibold text-gray-900 mb-2">
                  {variation.title}
                </h2>
                <p className="text-gray-600 mb-4">{variation.description}</p>
                <div className="flex flex-wrap gap-2 text-xs">
                  <span className="px-2 py-1 bg-blue-100 text-blue-800 rounded">
                    Template: {variation.config.template}
                  </span>
                  <span className="px-2 py-1 bg-purple-100 text-purple-800 rounded">
                    Position: {variation.config.behavior.position}
                  </span>
                  {variation.config.behavior.shrinkOnScroll && (
                    <span className="px-2 py-1 bg-green-100 text-green-800 rounded">
                      Shrink on Scroll
                    </span>
                  )}
                  {variation.config.behavior.hideOnScrollDown && (
                    <span className="px-2 py-1 bg-orange-100 text-orange-800 rounded">
                      Hide on Scroll Down
                    </span>
                  )}
                  {variation.config.behavior.transparent && (
                    <span className="px-2 py-1 bg-pink-100 text-pink-800 rounded">
                      Transparent
                    </span>
                  )}
                </div>
              </div>

              {/* Header Preview - Responsive Container */}
              <div className="flex justify-center bg-gray-100 rounded-lg p-4">
                <div
                  className={`relative border-2 border-gray-300 rounded-lg overflow-auto bg-white transition-all duration-300 ${variation.containerClass || "h-[400px]"}`}
                  style={{ width: viewportWidths[viewport], maxWidth: "100%" }}
                >
                  <HeaderRenderer
                    config={variation.config}
                    menu={sampleMenu}
                    logos={logos}
                  />
                  <div className="p-8">
                    <div className="max-w-3xl mx-auto space-y-4">
                      <h3 className="text-2xl font-semibold">Sample Content</h3>
                      <p className="text-gray-600">
                        Scroll this container to test scroll-based behaviors.
                        The header above will respond to scrolling based on its
                        configuration.
                      </p>
                      <div className="grid grid-cols-2 gap-4 mt-8">
                        <div className="bg-gray-100 rounded-lg p-6 h-32" />
                        <div className="bg-gray-100 rounded-lg p-6 h-32" />
                        <div className="bg-gray-100 rounded-lg p-6 h-32" />
                        <div className="bg-gray-100 rounded-lg p-6 h-32" />
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Token Reference */}
        <div className="max-w-7xl mx-auto px-8 py-12">
          <div className="bg-white rounded-lg p-8 border border-gray-200">
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">
              Current Token Values
            </h2>
            <p className="text-gray-600 mb-6">
              Below are the platform default header tokens. These can be
              customized per-tenant.
            </p>
            <details className="mt-4">
              <summary className="cursor-pointer text-blue-600 hover:text-blue-800 font-medium">
                View Generated CSS (Click to expand)
              </summary>
              <pre className="mt-4 p-4 bg-gray-900 text-gray-100 rounded-lg overflow-auto text-sm">
                {tokenCSS}
              </pre>
            </details>
          </div>
        </div>
      </div>
    </>
  );
}
