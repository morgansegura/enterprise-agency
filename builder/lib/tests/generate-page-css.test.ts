/**
 * End-to-end test for generatePageCSS
 *
 * Verifies every Style tab property category produces correct CSS output
 * for sections, containers, and blocks. This is the regression suite for
 * the property → store → CSS pipeline.
 */

import { describe, it, expect } from "vitest";
import { generatePageCSS, getElementClass } from "@enterprise/tokens";
import type { Section } from "@/lib/types/section";

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

function buildPage(sections: Partial<Section>[]): Section[] {
  return sections.map(
    (s, i) =>
      ({
        _type: "section",
        _key: s._key ?? `s${i}`,
        containers: s.containers ?? [],
        ...s,
      }) as Section,
  );
}

function makeBlock(key: string, styles?: Record<string, string>) {
  return {
    _type: "heading-block",
    _key: key,
    data: { text: "Test" },
    ...(styles ? { styles } : {}),
  };
}

function makeContainer(
  key: string,
  blocks: ReturnType<typeof makeBlock>[],
  styles?: Record<string, string>,
) {
  return {
    _type: "container" as const,
    _key: key,
    layout: { type: "stack" as const },
    blocks,
    ...(styles ? { styles } : {}),
  };
}

// ---------------------------------------------------------------------------
// Tests
// ---------------------------------------------------------------------------

describe("generatePageCSS — section properties", () => {
  it("generates background-color for section.styles.backgroundColor", () => {
    const css = generatePageCSS(
      buildPage([
        { _key: "s1", styles: { backgroundColor: "#ff6b35" }, containers: [] },
      ]) as never[],
    );
    expect(css).toContain("background-color: #ff6b35");
    expect(css).toContain(".e-s1");
  });

  it("generates padding properties for sections", () => {
    const css = generatePageCSS(
      buildPage([
        {
          _key: "s1",
          styles: {
            paddingTop: "2rem",
            paddingRight: "1rem",
            paddingBottom: "2rem",
            paddingLeft: "1rem",
          },
          containers: [],
        },
      ]) as never[],
    );
    expect(css).toContain("padding-top: 2rem");
    expect(css).toContain("padding-right: 1rem");
    expect(css).toContain("padding-bottom: 2rem");
    expect(css).toContain("padding-left: 1rem");
  });

  it("generates margin properties for sections", () => {
    const css = generatePageCSS(
      buildPage([
        {
          _key: "s1",
          styles: {
            marginTop: "3rem",
            marginBottom: "1rem",
          },
          containers: [],
        },
      ]) as never[],
    );
    expect(css).toContain("margin-top: 3rem");
    expect(css).toContain("margin-bottom: 1rem");
  });

  it("generates size properties for sections", () => {
    const css = generatePageCSS(
      buildPage([
        {
          _key: "s1",
          styles: {
            width: "100%",
            maxWidth: "1200px",
            minHeight: "400px",
          },
          containers: [],
        },
      ]) as never[],
    );
    expect(css).toContain("width: 100%");
    expect(css).toContain("max-width: 1200px");
    expect(css).toContain("min-height: 400px");
  });

  it("generates border properties for sections", () => {
    const css = generatePageCSS(
      buildPage([
        {
          _key: "s1",
          styles: {
            borderWidth: "2px",
            borderStyle: "solid",
            borderColor: "#000",
            borderRadius: "12px",
          },
          containers: [],
        },
      ]) as never[],
    );
    expect(css).toContain("border-width: 2px");
    expect(css).toContain("border-style: solid");
    expect(css).toContain("border-color: #000");
    expect(css).toContain("border-radius: 12px");
  });

  it("generates per-corner border-radius", () => {
    const css = generatePageCSS(
      buildPage([
        {
          _key: "s1",
          styles: {
            borderTopLeftRadius: "10px",
            borderTopRightRadius: "20px",
            borderBottomRightRadius: "30px",
            borderBottomLeftRadius: "40px",
          },
          containers: [],
        },
      ]) as never[],
    );
    expect(css).toContain("border-top-left-radius: 10px");
    expect(css).toContain("border-top-right-radius: 20px");
    expect(css).toContain("border-bottom-right-radius: 30px");
    expect(css).toContain("border-bottom-left-radius: 40px");
  });

  it("generates effect properties for sections", () => {
    const css = generatePageCSS(
      buildPage([
        {
          _key: "s1",
          styles: {
            opacity: "0.8",
            boxShadow: "0px 4px 6px rgba(0,0,0,0.1)",
            mixBlendMode: "multiply",
          },
          containers: [],
        },
      ]) as never[],
    );
    expect(css).toContain("opacity: 0.8");
    expect(css).toContain("box-shadow: 0px 4px 6px");
    expect(css).toContain("mix-blend-mode: multiply");
  });

  it("generates transform and filter properties", () => {
    const css = generatePageCSS(
      buildPage([
        {
          _key: "s1",
          styles: {
            transform: "translateY(-2px) rotate(5deg)",
            transformOrigin: "center",
            filter: "brightness(1.1)",
            backdropFilter: "blur(8px)",
          },
          containers: [],
        },
      ]) as never[],
    );
    expect(css).toContain("transform: translateY(-2px) rotate(5deg)");
    expect(css).toContain("transform-origin: center");
    expect(css).toContain("filter: brightness(1.1)");
    expect(css).toContain("backdrop-filter: blur(8px)");
  });

  it("generates transition properties", () => {
    const css = generatePageCSS(
      buildPage([
        {
          _key: "s1",
          styles: {
            transition: "all 0.3s ease",
            transitionDuration: "300ms",
            transitionDelay: "100ms",
          },
          containers: [],
        },
      ]) as never[],
    );
    expect(css).toContain("transition: all 0.3s ease");
    expect(css).toContain("transition-duration: 300ms");
    expect(css).toContain("transition-delay: 100ms");
  });

  it("generates position properties", () => {
    const css = generatePageCSS(
      buildPage([
        {
          _key: "s1",
          styles: {
            position: "relative",
            top: "10px",
            left: "20px",
            zIndex: "5",
            overflow: "hidden",
          },
          containers: [],
        },
      ]) as never[],
    );
    expect(css).toContain("position: relative");
    expect(css).toContain("top: 10px");
    expect(css).toContain("left: 20px");
    expect(css).toContain("z-index: 5");
    expect(css).toContain("overflow: hidden");
  });

  it("generates layout (display/flex/grid) properties", () => {
    const css = generatePageCSS(
      buildPage([
        {
          _key: "s1",
          styles: {
            display: "flex",
            flexDirection: "row",
            justifyContent: "center",
            alignItems: "center",
            gap: "1rem",
            flexWrap: "wrap",
          },
          containers: [],
        },
      ]) as never[],
    );
    expect(css).toContain("display: flex");
    expect(css).toContain("flex-direction: row");
    expect(css).toContain("justify-content: center");
    expect(css).toContain("align-items: center");
    expect(css).toContain("gap: 1rem");
    expect(css).toContain("flex-wrap: wrap");
  });

  it("generates cursor and interaction properties", () => {
    const css = generatePageCSS(
      buildPage([
        {
          _key: "s1",
          styles: {
            cursor: "pointer",
            pointerEvents: "auto",
            userSelect: "none",
          },
          containers: [],
        },
      ]) as never[],
    );
    expect(css).toContain("cursor: pointer");
    expect(css).toContain("pointer-events: auto");
    expect(css).toContain("user-select: none");
  });
});

describe("generatePageCSS — typography properties", () => {
  it("generates all font properties on a heading block", () => {
    const css = generatePageCSS(
      buildPage([
        {
          _key: "s1",
          containers: [
            makeContainer("c1", [
              makeBlock("b1", {
                fontFamily: "Inter, sans-serif",
                fontSize: "48px",
                fontWeight: "700",
                fontStyle: "italic",
                lineHeight: "1.2",
                letterSpacing: "-0.02em",
                textAlign: "center",
                textTransform: "uppercase",
                textDecoration: "underline",
                textShadow: "0px 2px 4px rgba(0,0,0,0.1)",
                color: "#1a1a1a",
                whiteSpace: "nowrap",
                wordSpacing: "0.1em",
                textIndent: "2em",
              }),
            ]),
          ],
        },
      ]) as never[],
    );
    expect(css).toContain("font-family: Inter, sans-serif");
    expect(css).toContain("font-size: 48px");
    expect(css).toContain("font-weight: 700");
    expect(css).toContain("font-style: italic");
    expect(css).toContain("line-height: 1.2");
    expect(css).toContain("letter-spacing: -0.02em");
    expect(css).toContain("text-align: center");
    expect(css).toContain("text-transform: uppercase");
    expect(css).toContain("text-decoration: underline");
    expect(css).toContain("text-shadow: 0px 2px 4px");
    expect(css).toContain("color: #1a1a1a");
    expect(css).toContain("white-space: nowrap");
    expect(css).toContain("word-spacing: 0.1em");
    expect(css).toContain("text-indent: 2em");
  });
});

describe("generatePageCSS — container and block hierarchy", () => {
  it("generates rules for all three levels (section, container, block)", () => {
    const css = generatePageCSS(
      buildPage([
        {
          _key: "s1",
          styles: { backgroundColor: "#fff" },
          containers: [
            makeContainer(
              "c1",
              [makeBlock("b1", { color: "#ff0000" })],
              { padding: "1rem", backgroundColor: "#fafafa" },
            ),
          ],
        },
      ]) as never[],
    );
    // Section rule
    expect(css).toContain(".e-s1");
    expect(css).toContain("background-color: #fff");
    // Container rule
    expect(css).toContain(".e-c1");
    expect(css).toContain("background-color: #fafafa");
    // Block rule
    expect(css).toContain(".e-b1");
    expect(css).toContain("color: #ff0000");
  });

  it("getElementClass returns the correct class for an element key", () => {
    expect(getElementClass("abc123")).toBe("e-abc123");
  });
});

describe("generatePageCSS — responsive breakpoints", () => {
  it("generates @media rules for tablet and mobile overrides", () => {
    const sections = buildPage([
      {
        _key: "s1",
        styles: { fontSize: "48px" },
        containers: [],
        _responsive: {
          tablet: { styles: { fontSize: "36px" } },
          mobile: { styles: { fontSize: "24px" } },
        },
      } as Partial<Section>,
    ]);
    const css = generatePageCSS(sections as never[]);
    expect(css).toContain("@media (max-width: 1024px)");
    expect(css).toContain("@media (max-width: 640px)");
    expect(css).toContain("font-size: 36px");
    expect(css).toContain("font-size: 24px");
  });
});

describe("generatePageCSS — pseudo-elements", () => {
  it("generates ::before pseudo-element rules", () => {
    const sections = buildPage([
      {
        _key: "s1",
        containers: [
          makeContainer("c1", [
            {
              ...makeBlock("b1"),
              stylesBefore: {
                content: '"—"',
                color: "#3b82f6",
                fontSize: "24px",
              },
            },
          ]),
        ],
      },
    ]);
    const css = generatePageCSS(sections as never[]);
    expect(css).toContain("::before");
    expect(css).toContain('content: "—"');
    expect(css).toContain("color: #3b82f6");
  });

  it("generates ::after pseudo-element rules", () => {
    const sections = buildPage([
      {
        _key: "s1",
        containers: [
          makeContainer("c1", [
            {
              ...makeBlock("b1"),
              stylesAfter: {
                content: '""',
                display: "block",
                width: "60px",
                height: "3px",
                backgroundColor: "#3b82f6",
              },
            },
          ]),
        ],
      },
    ]);
    const css = generatePageCSS(sections as never[]);
    expect(css).toContain("::after");
    expect(css).toContain("display: block");
    expect(css).toContain("width: 60px");
    expect(css).toContain("background-color: #3b82f6");
  });
});

describe("generatePageCSS — specificity", () => {
  it("uses doubled class selector .e-key.e-key for higher specificity than data-attribute rules", () => {
    const css = generatePageCSS(
      buildPage([
        {
          _key: "s1",
          containers: [
            makeContainer("c1", [
              makeBlock("b1", { fontSize: "8px" }),
            ]),
          ],
        },
      ]) as never[],
    );
    // Doubled class selector beats .heading[data-size="5xl"] (specificity 0,2,0)
    expect(css).toContain(".e-b1.e-b1");
    expect(css).toContain("font-size: 8px");
  });

  it("includes the > * variant to target wrapped block elements", () => {
    const css = generatePageCSS(
      buildPage([
        {
          _key: "s1",
          containers: [
            makeContainer("c1", [
              makeBlock("b1", { fontSize: "8px" }),
            ]),
          ],
        },
      ]) as never[],
    );
    // Child selector for client withStyles wrapper pattern
    expect(css).toContain(".e-b1.e-b1 > *");
  });
});

describe("generatePageCSS — empty/no-op cases", () => {
  it("returns empty string for no sections", () => {
    expect(generatePageCSS([])).toBe("");
  });

  it("returns empty string for sections without styles", () => {
    const css = generatePageCSS(
      buildPage([{ _key: "s1", containers: [] }]) as never[],
    );
    expect(css).toBe("");
  });

  it("does not generate rules for empty styles objects", () => {
    const css = generatePageCSS(
      buildPage([{ _key: "s1", styles: {}, containers: [] }]) as never[],
    );
    expect(css).toBe("");
  });
});
