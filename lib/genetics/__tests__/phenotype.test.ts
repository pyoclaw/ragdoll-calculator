/**
 * Unit tests for phenotype mapping.
 * Validates that genotypes correctly map to color, pattern, and overlay phenotypes.
 */

import { describe, it, expect } from "vitest";
import {
  genotypeToColor,
  genotypeToPattern,
  genotypeToOverlay,
  genotypeToPhenotype,
  phenotypeToString,
} from "../phenotype";
import { Genotype } from "../types";

describe("Phenotype Mapping", () => {
  const baseGenotype: Genotype = {
    B: ["B", "B"],
    D: ["D", "D"],
    O: ["o", "o"],
    Cs: ["cs", "cs"],
    Wg: ["+", "+"],
    S: ["s", "s"],
    Ta: ["t^b", "t^b"],
  };

  describe("Color Phenotype (B & D Loci)", () => {
    it("should identify seal (B/_, D/_) color", () => {
      const genotype = baseGenotype;
      expect(genotypeToColor(genotype, "female")).toBe("seal");
    });

    it("should identify blue (B/_, d/d) color", () => {
      const genotype = { ...baseGenotype, D: ["d", "d"] as [string, string] };
      expect(genotypeToColor(genotype, "female")).toBe("blue");
    });

    it("should identify chocolate (b/b, D/_) color", () => {
      const genotype = { ...baseGenotype, B: ["b", "b"] as [string, string] };
      expect(genotypeToColor(genotype, "female")).toBe("chocolate");
    });

    it("should identify lilac (b/b, d/d) color", () => {
      const genotype = {
        ...baseGenotype,
        B: ["b", "b"] as [string, string],
        D: ["d", "d"] as [string, string],
      };
      expect(genotypeToColor(genotype, "female")).toBe("lilac");
    });

    it("should identify cinnamon (b_l/_, D/_) color", () => {
      const genotype = {
        ...baseGenotype,
        B: ["b_l", "b_l"] as [string, string],
      };
      expect(genotypeToColor(genotype, "female")).toBe("cinnamon");
    });

    it("should identify fawn (b_l/_, d/d) color", () => {
      const genotype = {
        ...baseGenotype,
        B: ["b_l", "b_l"] as [string, string],
        D: ["d", "d"] as [string, string],
      };
      expect(genotypeToColor(genotype, "female")).toBe("fawn");
    });

    it("should identify red in males with O allele", () => {
      const genotype = { ...baseGenotype, O: ["O"] as [string] };
      expect(genotypeToColor(genotype, "male")).toBe("red");
    });

    it("should identify cream in dilute males with O allele", () => {
      const genotype = {
        ...baseGenotype,
        D: ["d", "d"] as [string, string],
        O: ["O"] as [string],
      };
      expect(genotypeToColor(genotype, "male")).toBe("cream");
    });

    it("should identify tortoiseshell in heterozygous females with O", () => {
      const genotype = {
        ...baseGenotype,
        B: ["B", "b"] as [string, string],
        O: ["O", "o"] as [string, string],
      };
      expect(genotypeToColor(genotype, "female")).toBe("tortoiseshell");
    });

    it("should identify blue-cream in dilute heterozygous females with O", () => {
      const genotype = {
        ...baseGenotype,
        B: ["b", "b"] as [string, string],
        D: ["d", "d"] as [string, string],
        O: ["O", "o"] as [string, string],
      };
      expect(genotypeToColor(genotype, "female")).toBe("blue-cream");
    });
  });

  describe("Pattern Phenotype (Wg & S Loci)", () => {
    it("should identify colorpoint (w_g/w_g, s/s)", () => {
      const genotype = baseGenotype;
      expect(genotypeToPattern(genotype)).toBe("colorpoint");
    });

    it("should identify mitted (w_g/+, s/s)", () => {
      const genotype = { ...baseGenotype, Wg: ["w_g", "+"] as [string, string] };
      expect(genotypeToPattern(genotype)).toBe("mitted");
    });

    it("should identify bicolor (S/s or S/S, any Wg)", () => {
      const genotype = { ...baseGenotype, S: ["S", "s"] as [string, string] };
      expect(genotypeToPattern(genotype)).toBe("bicolor");
    });

    it("should identify bicolor with S/S", () => {
      const genotype = { ...baseGenotype, S: ["S", "S"] as [string, string] };
      expect(genotypeToPattern(genotype)).toBe("bicolor");
    });

    it("should prioritize bicolor over mitted when both are present", () => {
      const genotype = {
        ...baseGenotype,
        Wg: ["w_g", "+"] as [string, string],
        S: ["S", "s"] as [string, string],
      };
      expect(genotypeToPattern(genotype)).toBe("bicolor");
    });

    it("should not be mitted with +/+ (both wild-type)", () => {
      const genotype = { ...baseGenotype, Wg: ["+", "+"] as [string, string] };
      expect(genotypeToPattern(genotype)).not.toBe("mitted");
    });
  });

  describe("Overlay Phenotype (Ta Locus)", () => {
    it("should identify no overlay (t^b/t^b)", () => {
      const genotype = baseGenotype;
      expect(genotypeToOverlay(genotype)).toBe("none");
    });

    it("should identify lynx (T^a/t^b)", () => {
      const genotype = {
        ...baseGenotype,
        Ta: ["T^a", "t^b"] as [string, string],
      };
      expect(genotypeToOverlay(genotype)).toBe("lynx");
    });

    it("should identify lynx (T^a/T^a)", () => {
      const genotype = {
        ...baseGenotype,
        Ta: ["T^a", "T^a"] as [string, string],
      };
      expect(genotypeToOverlay(genotype)).toBe("lynx");
    });
  });

  describe("Complete Phenotype", () => {
    it("should map complete genotype to phenotype", () => {
      const genotype = baseGenotype;
      const phenotype = genotypeToPhenotype(genotype, "female");

      expect(phenotype.color).toBe("seal");
      expect(phenotype.pattern).toBe("colorpoint");
      expect(phenotype.overlay).toBe("none");
      expect(phenotype.sex).toBe("female");
    });

    it("should create phenotype with all loci", () => {
      const genotype = {
        ...baseGenotype,
        B: ["B", "b"] as [string, string],
        D: ["D", "d"] as [string, string],
        O: ["O", "o"] as [string, string],
        Wg: ["w_g", "+"] as [string, string],
        S: ["S", "s"] as [string, string],
        Ta: ["T^a", "t^b"] as [string, string],
      };

      const phenotype = genotypeToPhenotype(genotype, "female");

      expect(phenotype.color).toBe("tortoiseshell");
      expect(phenotype.pattern).toBe("bicolor");
      expect(phenotype.overlay).toBe("lynx");
      expect(phenotype.sex).toBe("female");
    });
  });

  describe("Phenotype String Formatting", () => {
    it("should format seal colorpoint correctly", () => {
      const phenotype = {
        color: "seal" as const,
        pattern: "colorpoint" as const,
        overlay: "none" as const,
        sex: "female" as const,
      };

      expect(phenotypeToString(phenotype)).toBe("Seal Colorpoint");
    });

    it("should format lynx overlay correctly", () => {
      const phenotype = {
        color: "seal" as const,
        pattern: "colorpoint" as const,
        overlay: "lynx" as const,
        sex: "female" as const,
      };

      expect(phenotypeToString(phenotype)).toBe("Seal Point Colorpoint Lynx");
    });

    it("should format chocolate mitted correctly", () => {
      const phenotype = {
        color: "chocolate" as const,
        pattern: "mitted" as const,
        overlay: "none" as const,
        sex: "female" as const,
      };

      expect(phenotypeToString(phenotype)).toBe("Chocolate Mitted");
    });

    it("should format blue bicolor lynx correctly", () => {
      const phenotype = {
        color: "blue" as const,
        pattern: "bicolor" as const,
        overlay: "lynx" as const,
        sex: "male" as const,
      };

      expect(phenotypeToString(phenotype)).toBe("Blue Point Bicolor Lynx");
    });
  });
});
