/**
 * Ragdoll color phenotype catalog with display information
 */

export interface ColorInfo {
  name: string;
  description: string;
  geneticBasis: string;
  hexColor: string;
  accentColor: string; // for contrast/display
}

export const COLORS: Record<string, ColorInfo> = {
  seal: {
    name: "Seal",
    description:
      "Dark brown coloring on the points with warm cream body. The signature Ragdoll color, named for its resemblance to seal fur.",
    geneticBasis: "B/_, D/D (dense black with warm undertones)",
    hexColor: "#6B4423",
    accentColor: "#F5E6D3",
  },
  chocolate: {
    name: "Chocolate",
    description:
      "Milk chocolate points with ivory body. Warmer and lighter than seal due to the recessive brown allele.",
    geneticBasis: "b/b, D/_ (dense brown/chocolate)",
    hexColor: "#8B6F47",
    accentColor: "#FFFBF0",
  },
  blue: {
    name: "Blue",
    description:
      "Slate gray or blue-toned points with silvery-white body. A dilute version of seal color.",
    geneticBasis: "B/_, d/d (dilute black)",
    hexColor: "#7F8FA3",
    accentColor: "#E8EAED",
  },
  lilac: {
    name: "Lilac",
    description:
      "Soft gray-pink or lilac points with white body. The dilute version of chocolate, very pale and elegant.",
    geneticBasis: "b/b, d/d (dilute brown)",
    hexColor: "#A892A3",
    accentColor: "#F9F7F9",
  },
  red: {
    name: "Red",
    description:
      "Orange or red points with cream body. Males only (X-linked). Warm, vibrant color.",
    geneticBasis: "B/_, D/D, O/Y (dense orange, male hemizygous)",
    hexColor: "#E67E4E",
    accentColor: "#FFF5F0",
  },
  cream: {
    name: "Cream",
    description:
      "Pale cream points with white body. The dilute version of red. Soft and gentle appearance.",
    geneticBasis: "B/_, d/d, O/Y (dilute orange, male hemizygous)",
    hexColor: "#F4C4A0",
    accentColor: "#FFFEF8",
  },
  cinnamon: {
    name: "Cinnamon",
    description:
      "Light reddish-brown points with warm ivory body. Rare color, warmer than chocolate.",
    geneticBasis: "b_l/_, D/_ (cinnamon/red dilute primary allele, dense)",
    hexColor: "#C9A97E",
    accentColor: "#FEF8F5",
  },
  fawn: {
    name: "Fawn",
    description:
      "Pale pinkish-beige points with white body. The dilute version of cinnamon, very rare and delicate.",
    geneticBasis: "b_l/_, d/d (cinnamon/red dilute primary, dilute)",
    hexColor: "#D9B8A8",
    accentColor: "#FEF9F7",
  },
  tortoiseshell: {
    name: "Tortoiseshell",
    description:
      "Patchwork of red and seal colors on points. Females only (heterozygous O). Created by X-inactivation.",
    geneticBasis:
      "B/_, D/_, O/o (female, heterozygous for red - mosaicism creates color patches)",
    hexColor: "#C97456",
    accentColor: "#F8E8E0",
  },
  "blue-cream": {
    name: "Blue-Cream",
    description:
      "Patchwork of cream and blue on points. Female-only dilute tortoiseshell.",
    geneticBasis: "b/b, d/d, O/o (female, heterozygous for red, fully dilute)",
    hexColor: "#A9A597",
    accentColor: "#F5F3F0",
  },
};

/**
 * Get color information by color name
 */
export function getColorInfo(colorName: string): ColorInfo | undefined {
  return COLORS[colorName];
}

/**
 * Get all available colors
 */
export function getAllColors(): string[] {
  return Object.keys(COLORS);
}
