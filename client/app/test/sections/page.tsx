"use client";

import { useState } from "react";
import { SectionRenderer, type TypedSection } from "@/components/section-renderer";

/**
 * Test page for Section → Container → Block rendering
 * URL: /test/sections
 *
 * This page demonstrates the complete rendering pipeline without requiring
 * the API backend. Use this to verify WYSIWYG parity between builder and client.
 */

// Sample sections data matching the new architecture
const initialSections: TypedSection[] = [
  // Hero Section - centered content
  {
    _key: "hero-section",
    _type: "section",
    as: "section",
    background: "primary",
    paddingY: "2xl",
    width: "full",
    align: "center",
    containers: [
      {
        _key: "hero-container",
        _type: "container",
        layout: {
          type: "stack",
          gap: "lg",
        },
        maxWidth: "lg",
        align: "center",
        blocks: [
          {
            _key: "hero-heading",
            _type: "heading-block",
            data: {
              text: "Section → Container → Block",
              level: "h1",
              size: "5xl",
              align: "center",
              weight: "bold",
            },
          },
          {
            _key: "hero-text",
            _type: "text-block",
            data: {
              content: "This page tests the complete rendering architecture. Each section contains containers, and each container holds blocks.",
              size: "xl",
              align: "center",
            },
          },
        ],
      },
    ],
  },

  // Two-Column Section - grid layout
  {
    _key: "features-section",
    _type: "section",
    as: "section",
    background: "white",
    paddingY: "xl",
    width: "wide",
    containers: [
      {
        _key: "features-header-container",
        _type: "container",
        layout: {
          type: "stack",
          gap: "md",
        },
        align: "center",
        paddingY: "md",
        blocks: [
          {
            _key: "features-heading",
            _type: "heading-block",
            data: {
              text: "Grid Container",
              level: "h2",
              size: "3xl",
              align: "center",
            },
          },
          {
            _key: "features-subtext",
            _type: "text-block",
            data: {
              content: "This section has two containers - a header and a 3-column grid.",
              align: "center",
            },
          },
        ],
      },
      {
        _key: "features-grid-container",
        _type: "container",
        layout: {
          type: "grid",
          columns: 3,
          gap: "lg",
        },
        paddingY: "md",
        blocks: [
          {
            _key: "feature-1",
            _type: "card-block",
            data: {
              title: "Feature One",
              description: "Sections are semantic HTML wrappers (<section>, <article>, etc.)",
            },
          },
          {
            _key: "feature-2",
            _type: "card-block",
            data: {
              title: "Feature Two",
              description: "Containers handle layout (stack, flex, grid) and styling.",
            },
          },
          {
            _key: "feature-3",
            _type: "card-block",
            data: {
              title: "Feature Three",
              description: "Blocks are the actual content components inside containers.",
            },
          },
        ],
      },
    ],
  },

  // Flex Container - horizontal buttons
  {
    _key: "cta-section",
    _type: "section",
    as: "section",
    background: "gray",
    paddingY: "xl",
    width: "narrow",
    align: "center",
    containers: [
      {
        _key: "cta-content-container",
        _type: "container",
        layout: {
          type: "stack",
          gap: "md",
        },
        align: "center",
        blocks: [
          {
            _key: "cta-heading",
            _type: "heading-block",
            data: {
              text: "Flex Container",
              level: "h2",
              size: "2xl",
              align: "center",
            },
          },
          {
            _key: "cta-text",
            _type: "text-block",
            data: {
              content: "The buttons below use a flex container with horizontal layout.",
              align: "center",
            },
          },
        ],
      },
      {
        _key: "cta-buttons-container",
        _type: "container",
        layout: {
          type: "flex",
          direction: "row",
          gap: "md",
          justify: "center",
          wrap: true,
        },
        blocks: [
          {
            _key: "cta-btn-1",
            _type: "button-block",
            data: {
              text: "Primary Action",
              href: "#",
              variant: "default",
              size: "lg",
            },
          },
          {
            _key: "cta-btn-2",
            _type: "button-block",
            data: {
              text: "Secondary Action",
              href: "#",
              variant: "outline",
              size: "lg",
            },
          },
        ],
      },
    ],
  },

  // Container with border and shadow
  {
    _key: "styled-section",
    _type: "section",
    as: "section",
    background: "white",
    paddingY: "xl",
    width: "narrow",
    containers: [
      {
        _key: "styled-container",
        _type: "container",
        layout: {
          type: "stack",
          gap: "md",
        },
        paddingX: "lg",
        paddingY: "lg",
        border: "thin",
        borderRadius: "lg",
        shadow: "md",
        blocks: [
          {
            _key: "styled-heading",
            _type: "heading-block",
            data: {
              text: "Styled Container",
              level: "h3",
              size: "xl",
            },
          },
          {
            _key: "styled-text",
            _type: "text-block",
            data: {
              content: "This container has padding, border, border-radius, and shadow applied. These styles are controlled via data-* attributes for WYSIWYG parity.",
            },
          },
          {
            _key: "styled-quote",
            _type: "quote-block",
            data: {
              quote: "The same CSS drives both the builder preview and client render.",
              author: "Architecture Principle",
            },
          },
        ],
      },
    ],
  },
];

export default function SectionsTestPage() {
  const [sections, setSections] = useState<TypedSection[]>(initialSections);
  const [showJson, setShowJson] = useState(false);

  return (
    <div className="min-h-screen">
      {/* Controls */}
      <div className="fixed top-4 right-4 z-50 flex gap-2">
        <button
          onClick={() => setShowJson(!showJson)}
          className="px-4 py-2 bg-gray-900 text-white rounded-lg shadow-lg hover:bg-gray-800 text-sm"
        >
          {showJson ? "Hide JSON" : "Show JSON"}
        </button>
      </div>

      {/* JSON Debug Panel */}
      {showJson && (
        <div className="fixed inset-0 z-40 bg-black/50 overflow-auto p-8">
          <div className="max-w-4xl mx-auto bg-gray-900 rounded-lg p-6 text-white">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-lg font-bold">Section Data (JSON)</h2>
              <button
                onClick={() => setShowJson(false)}
                className="text-gray-400 hover:text-white"
              >
                Close
              </button>
            </div>
            <pre className="text-xs overflow-auto max-h-[80vh]">
              {JSON.stringify(sections, null, 2)}
            </pre>
          </div>
        </div>
      )}

      {/* Rendered Sections */}
      <SectionRenderer sections={sections} />
    </div>
  );
}
