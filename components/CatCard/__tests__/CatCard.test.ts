/**
 * Tests for the CatCard component's logic and its direct dependencies.
 *
 * Since the test environment is Node.js (no DOM), we cannot render the React
 * component. Instead, we test:
 *   1. The probability-to-percentage formatting logic used by CatCard.
 *   2. The `getColorInfo` helper that CatCard relies on for colour display.
 *   3. The `phenotypeToString` function that computes the displayed label.
 *
 * These cover every branch of the computation inside CatCard without needing
 * a browser / jsdom environment.
 */

import { describe, it, expect } from "vitest";
import { getColorInfo, getAllColors } from "@/lib/data/colors";
import { phenotypeToString } from "@/lib/genetics/phenotype";
import { Phenotype } from "@/lib/genetics/types";

// ---------------------------------------------------------------------------
// Probability → percentage text  (mirrors CatCard's internal logic)
// ---------------------------------------------------------------------------

/**
 * Replicate the exact formula CatCard uses so we can test the edge cases
 * without rendering the component.
 */
function formatProbability(probability: number | undefined): string | undefined {
  return probability && probability > 0
    ? `${(probability * 100).toFixed(1)}%`
    : undefined;
}

describe("CatCard probability text logic", () => {
  it("formats a mid-range probability correctly", () => {
    expect(formatProbability(0.25)).toBe("25.0%");
  });

  it("formats 100% probability as '100.0%'", () => {
    expect(formatProbability(1.0)).toBe("100.0%");
  });

  it("formats a small probability correctly", () => {
    expect(formatProbability(0.0625)).toBe("6.3%");
  });

  it("returns undefined when probability is 0", () => {
    // CatCard only shows the badge when probability > 0
    expect(formatProbability(0)).toBeUndefined();
  });

  it("returns undefined when probability is undefined", () => {
    expect(formatProbability(undefined)).toBeUndefined();
  });

  it("rounds correctly to one decimal place", () => {
    // 1/3 ≈ 33.3%
    expect(formatProbability(1 / 3)).toBe("33.3%");
  });
});

// ---------------------------------------------------------------------------
// getColorInfo (used by CatCard for colour swatch hex and display name)
// ---------------------------------------------------------------------------

describe("getColorInfo", () => {
  it("returns a ColorInfo object for 'seal'", () => {
    const info = getColorInfo("seal");
    expect(info).toBeDefined();
    expect(info?.name).toBe("Seal");
    expect(info?.hexColor).toMatch(/^#[0-9A-Fa-f]{6}$/);
  });

  it("returns a ColorInfo object for every colour in the catalogue", () => {
    const colors = getAllColors();
    for (const color of colors) {
      const info = getColorInfo(color);
      expect(info, `Expected ColorInfo for '${color}'`).toBeDefined();
      expect(info?.hexColor).toMatch(/^#[0-9A-Fa-f]{6}$/);
    }
  });

  it("returns undefined for an unknown colour name", () => {
    expect(getColorInfo("turquoise")).toBeUndefined();
    expect(getColorInfo("")).toBeUndefined();
  });

  it("provides a fallback hex ('#999') equivalent via undefined for unknown colours", () => {
    // CatCard uses: colorInfo?.hexColor || '#999'
    const info = getColorInfo("unknown");
    const hex = info?.hexColor || "#999";
    expect(hex).toBe("#999");
  });

  it("returns correct hex for 'blue-cream' (hyphenated key)", () => {
    const info = getColorInfo("blue-cream");
    expect(info).toBeDefined();
    expect(info?.name).toBe("Blue-Cream");
  });

  it("includes a non-empty description and geneticBasis for each colour", () => {
    const colors = getAllColors();
    for (const color of colors) {
      const info = getColorInfo(color);
      expect(info?.description.length, `description missing for ${color}`).toBeGreaterThan(0);
      expect(info?.geneticBasis.length, `geneticBasis missing for ${color}`).toBeGreaterThan(0);
    }
  });
});

// ---------------------------------------------------------------------------
// phenotypeToString (used by CatCard for the card title / display name)
// ---------------------------------------------------------------------------

describe("phenotypeToString", () => {
  it("formats a seal colorpoint with no overlay", () => {
    const p: Phenotype = { color: "seal", pattern: "colorpoint", overlay: "none", sex: "male" };
    expect(phenotypeToString(p)).toBe("Seal Colorpoint");
  });

  it("formats a blue mitted with no overlay", () => {
    const p: Phenotype = { color: "blue", pattern: "mitted", overlay: "none", sex: "female" };
    expect(phenotypeToString(p)).toBe("Blue Mitted");
  });

  it("formats a chocolate bicolor with no overlay", () => {
    const p: Phenotype = { color: "chocolate", pattern: "bicolor", overlay: "none", sex: "male" };
    expect(phenotypeToString(p)).toBe("Chocolate Bicolor");
  });

  it("includes 'Lynx' and 'Point' in the string when overlay is 'lynx'", () => {
    const p: Phenotype = { color: "seal", pattern: "colorpoint", overlay: "lynx", sex: "female" };
    const result = phenotypeToString(p);
    expect(result).toContain("Lynx");
    expect(result).toContain("Point");
    expect(result).toBe("Seal Point Colorpoint Lynx");
  });

  it("capitalises the first letter of both colour and pattern", () => {
    const p: Phenotype = { color: "lilac", pattern: "mitted", overlay: "none", sex: "male" };
    const result = phenotypeToString(p);
    expect(result[0]).toBe("L"); // Lilac
    expect(result).toContain("Mitted");
  });

  it("formats red lynx mitted correctly", () => {
    const p: Phenotype = { color: "red", pattern: "mitted", overlay: "lynx", sex: "male" };
    expect(phenotypeToString(p)).toBe("Red Point Mitted Lynx");
  });

  it("formats cream bicolor with no overlay", () => {
    const p: Phenotype = { color: "cream", pattern: "bicolor", overlay: "none", sex: "male" };
    expect(phenotypeToString(p)).toBe("Cream Bicolor");
  });

  it("formats tortoiseshell colorpoint", () => {
    const p: Phenotype = { color: "tortoiseshell", pattern: "colorpoint", overlay: "none", sex: "female" };
    expect(phenotypeToString(p)).toBe("Tortoiseshell Colorpoint");
  });

  it("formats blue-cream (hyphenated colour) correctly", () => {
    const p: Phenotype = { color: "blue-cream", pattern: "colorpoint", overlay: "none", sex: "female" };
    // charAt(0).toUpperCase() + slice(1) → "Blue-cream"
    expect(phenotypeToString(p)).toBe("Blue-cream Colorpoint");
  });

  it("sex field does not affect the string output", () => {
    const base = { color: "seal" as const, pattern: "colorpoint" as const, overlay: "none" as const };
    const male = phenotypeToString({ ...base, sex: "male" });
    const female = phenotypeToString({ ...base, sex: "female" });
    expect(male).toBe(female);
  });
});
