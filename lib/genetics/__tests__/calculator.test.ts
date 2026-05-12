/**
 * Unit tests for the genetics calculator.
 * Validates Punnett square logic against known Ragdoll breeding outcomes.
 */

import { describe, it, expect } from "vitest";
import { cross, summarizeByColor, summarizeByPattern } from "../calculator";
import { Genotype } from "../types";

describe("Genetics Calculator", () => {
  /**
   * Test case 1: Seal × Seal → all Seal (both homozygous)
   * Parent 1: B/B, D/D, o/o (female)
   * Parent 2: B/B, D/D, o/o (male)
   * Expected: 100% Seal
   */
  it("should produce all seal offspring from two homozygous seal parents", () => {
    const sealHomozygous: Genotype = {
      B: ["B", "B"],
      D: ["D", "D"],
      O: ["o", "o"],
      Cs: ["cs", "cs"],
      Wg: ["+", "+"],
      S: ["s", "s"],
      Ta: ["t^b", "t^b"],
    };

    const offspring = cross(sealHomozygous, sealHomozygous);
    const byColor = summarizeByColor(offspring);

    expect(byColor.get("seal")).toBeCloseTo(1.0, 2);
    expect(byColor.size).toBe(1); // Only one color
  });

  /**
   * Test case 2: Seal × Blue → 50% Seal, 50% Blue
   * Parent 1: B/B, D/d, o/o (female carrier of dilute)
   * Parent 2: B/B, d/d, o/o (male, fully dilute)
   * Expected: 50% Seal (D/d), 50% Blue (d/d)
   */
  it("should produce 50% seal and 50% blue from seal carrier × blue", () => {
    const sealCarrier: Genotype = {
      B: ["B", "B"],
      D: ["D", "d"],
      O: ["o", "o"],
      Cs: ["cs", "cs"],
      Wg: ["+", "+"],
      S: ["s", "s"],
      Ta: ["t^b", "t^b"],
    };

    const blue: Genotype = {
      B: ["B", "B"],
      D: ["d", "d"],
      O: ["o", "o"],
      Cs: ["cs", "cs"],
      Wg: ["+", "+"],
      S: ["s", "s"],
      Ta: ["t^b", "t^b"],
    };

    const offspring = cross(sealCarrier, blue);
    const byColor = summarizeByColor(offspring);

    expect(byColor.get("seal")).toBeCloseTo(0.5, 1);
    expect(byColor.get("blue")).toBeCloseTo(0.5, 1);
  });

  /**
   * Test case 3: Chocolate × Chocolate → all Chocolate
   * Parent 1: b/b, D/D, o/o (female)
   * Parent 2: b/b, D/D, o/o (male)
   * Expected: 100% Chocolate
   */
  it("should produce all chocolate from two homozygous chocolate parents", () => {
    const chocolateHomozygous: Genotype = {
      B: ["b", "b"],
      D: ["D", "D"],
      O: ["o", "o"],
      Cs: ["cs", "cs"],
      Wg: ["+", "+"],
      S: ["s", "s"],
      Ta: ["t^b", "t^b"],
    };

    const offspring = cross(chocolateHomozygous, chocolateHomozygous);
    const byColor = summarizeByColor(offspring);

    expect(byColor.get("chocolate")).toBeCloseTo(1.0, 2);
  });

  /**
   * Test case 4: Pattern inheritance - Colorpoint × Colorpoint (both homozygous)
   * Parent 1: w_g/w_g, S/S, o/o (female)
   * Parent 2: w_g/w_g, S/S, o/o (male)
   * Expected: 100% Colorpoint
   */
  it("should produce all colorpoint from homozygous colorpoint parents", () => {
    const colorpoint: Genotype = {
      B: ["B", "B"],
      D: ["D", "D"],
      O: ["o", "o"],
      Cs: ["cs", "cs"],
      Wg: ["w_g", "w_g"],
      S: ["s", "s"],
      Ta: ["t^b", "t^b"],
    };

    const offspring = cross(colorpoint, colorpoint);
    const byPattern = summarizeByPattern(offspring);

    expect(byPattern.get("colorpoint")).toBeCloseTo(1.0, 2);
    expect(byPattern.size).toBe(1);
  });

  /**
   * Test case 5: Mitted pattern - w_g/+ × w_g/+ (heterozygous)
   * Parent 1: w_g/+, s/s, o/o (female)
   * Parent 2: w_g/+, s/s, o/o (male)
   * Expected: 25% w_g/w_g (colorpoint), 50% w_g/+ (mitted), 25% +/+ (colorpoint)
   * So: 50% Mitted, 50% Colorpoint
   */
  it("should produce mitted and colorpoint from heterozygous mitted parents", () => {
    const mitted: Genotype = {
      B: ["B", "B"],
      D: ["D", "D"],
      O: ["o", "o"],
      Cs: ["cs", "cs"],
      Wg: ["w_g", "+"],
      S: ["s", "s"],
      Ta: ["t^b", "t^b"],
    };

    const offspring = cross(mitted, mitted);
    const byPattern = summarizeByPattern(offspring);

    expect(byPattern.get("mitted")).toBeCloseTo(0.5, 1);
    expect(byPattern.get("colorpoint")).toBeCloseTo(0.5, 1);
  });

  /**
   * Test case 6: Bicolor pattern - S/s × S/s
   * Expected: 25% S/S (bicolor), 50% S/s (bicolor), 25% s/s (colorpoint)
   * So: 75% Bicolor, 25% Colorpoint
   */
  it("should produce bicolor from heterozygous bicolor parents", () => {
    const bicolorHet: Genotype = {
      B: ["B", "B"],
      D: ["D", "D"],
      O: ["o", "o"],
      Cs: ["cs", "cs"],
      Wg: ["w_g", "w_g"],
      S: ["S", "s"],
      Ta: ["t^b", "t^b"],
    };

    const offspring = cross(bicolorHet, bicolorHet);
    const byPattern = summarizeByPattern(offspring);

    expect(byPattern.get("bicolor")).toBeCloseTo(0.75, 1);
    expect(byPattern.get("colorpoint")).toBeCloseTo(0.25, 1);
  });

  /**
   * Test case 7: Red color - Red male × Seal female
   * Parent 1: B/B, D/D, O/o (female, heterozygous for red)
   * Parent 2: B/B, D/D, O (male, hemizygous red)
   * Expected: 50% red females (B/B, D/D, O/O), 50% seal females (B/B, D/D, o/O)
   *           50% red males (B/B, D/D, O), 50% seal males (B/B, D/D, o)
   * So: 25% red female, 25% seal female, 25% red male, 25% seal male
   */
  it("should handle X-linked O locus correctly", () => {
    const sealFemaleHasO: Genotype = {
      B: ["B", "B"],
      D: ["D", "D"],
      O: ["O", "o"],
      Cs: ["cs", "cs"],
      Wg: ["+", "+"],
      S: ["s", "s"],
      Ta: ["t^b", "t^b"],
    };

    const redMale: Genotype = {
      B: ["B", "B"],
      D: ["D", "D"],
      O: ["O"],
      Cs: ["cs", "cs"],
      Wg: ["+", "+"],
      S: ["s", "s"],
      Ta: ["t^b", "t^b"],
    };

    const offspring = cross(sealFemaleHasO, redMale, "female", "male");
    const byColor = summarizeByColor(offspring);

    // Should have red and seal offspring
    expect(byColor.get("red")! + byColor.get("seal")!).toBeCloseTo(1.0, 1);
  });

  /**
   * Test case 8: Heterozygous for D locus
   * Parent 1: B/B, D/D (female) - all dense
   * Parent 2: B/B, D/d (male) - carrier for dilute
   *
   * D locus cross: D/D × D/d = 50% D/D, 50% D/d = 100% dense (seal)
   * So all offspring should be seal
   */
  it("should handle multi-locus crosses correctly", () => {
    const sealHomozygous: Genotype = {
      B: ["B", "B"],
      D: ["D", "D"],
      O: ["o", "o"],
      Cs: ["cs", "cs"],
      Wg: ["+", "+"],
      S: ["s", "s"],
      Ta: ["t^b", "t^b"],
    };

    const sealCarrier: Genotype = {
      B: ["B", "B"],
      D: ["D", "d"],
      O: ["o", "o"],
      Cs: ["cs", "cs"],
      Wg: ["+", "+"],
      S: ["s", "s"],
      Ta: ["t^b", "t^b"],
    };

    const offspring = cross(sealHomozygous, sealCarrier);
    const byColor = summarizeByColor(offspring);

    // D/D × D/d = all D/_ = all dense = all seal
    expect(byColor.get("seal")).toBeCloseTo(1.0, 1);
    expect(byColor.size).toBe(1);
  });

  /**
   * Test case 9: Verify offspring count matches probability
   * Check that probabilities sum to ~1.0
   */
  it("should sum offspring probabilities to 1.0", () => {
    const parent1: Genotype = {
      B: ["B", "b"],
      D: ["D", "d"],
      O: ["O", "o"],
      Cs: ["cs", "cs"],
      Wg: ["w_g", "+"],
      S: ["S", "s"],
      Ta: ["T^a", "t^b"],
    };

    const parent2: Genotype = {
      B: ["b", "b"],
      D: ["D", "d"],
      O: ["o"],
      Cs: ["cs", "cs"],
      Wg: ["+", "+"],
      S: ["S", "s"],
      Ta: ["T^a", "t^b"],
    };

    const offspring = cross(parent1, parent2);
    const totalProbability = offspring.reduce(
      (sum, item) => sum + item.probability,
      0
    );

    expect(totalProbability).toBeCloseTo(1.0, 2);
  });
});
