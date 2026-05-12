/**
 * Ragdoll pattern phenotype catalog with display information
 */

export interface PatternInfo {
  name: string;
  description: string;
  geneticBasis: string;
  whiteSpotting: string;
}

export const PATTERNS: Record<string, PatternInfo> = {
  colorpoint: {
    name: "Colorpoint",
    description:
      "The classic Ragdoll pattern. Dark color concentrated on the face, ears, legs (paws), and tail. Body is lighter, cream colored. No white markings.",
    geneticBasis:
      "w_g/w_g (no white glove), s/s (no piebald spotting). Determined by Cs locus homozygous (cs/cs) for all Ragdolls.",
    whiteSpotting: "None - solid point pattern",
  },
  mitted: {
    name: "Mitted",
    description:
      "Points like colorpoint, but with white gloves on the paws and a white blaze on the chin/chest. Named for the white 'mittens' or gloves on front paws.",
    geneticBasis: "w_g/+ (heterozygous at Wg locus), s/s (no piebald). White glove gene creates the distinctive white paw markings.",
    whiteSpotting: "White gloves on paws and optional white blaze on chin",
  },
  bicolor: {
    name: "Bicolor (Van)",
    description:
      "Extensive white spotting. Points on face and ears remain darkly colored, but body and legs are mostly white. Often called 'Van' pattern (inspired by Van Cat breeds).",
    geneticBasis:
      "Any Wg genotype, S/_ (at least one S allele for piebald spotting). The S allele controls piebald white spotting.",
    whiteSpotting:
      "Extensive white - face mask and ears keep color, legs/body mostly white",
  },
};

/**
 * Pattern genetic rules:
 * The Wg (white glove) locus:
 *   - w_g/w_g = colorpoint (no white gloves)
 *   - w_g/+ = mitted (white gloves appear)
 *   - +/+ = colorpoint (no white gloves)
 *
 * The S (piebald spotting) locus:
 *   - s/s = no piebald spotting (colorpoint or mitted, depending on Wg)
 *   - S/_ = piebald spotting present (bicolor pattern)
 *
 * Pattern determination priority:
 * 1. If any S allele → bicolor (dominant for extensive white)
 * 2. Else if w_g/+ (heterozygous) → mitted (white paws only)
 * 3. Else → colorpoint (no white markings)
 */

export function getPatternInfo(patternName: string): PatternInfo | undefined {
  return PATTERNS[patternName];
}

export function getAllPatterns(): string[] {
  return Object.keys(PATTERNS);
}

/**
 * Information about overlays (lynx/tabby markings)
 */
export interface OverlayInfo {
  name: string;
  description: string;
  geneticBasis: string;
}

export const OVERLAYS: Record<string, OverlayInfo> = {
  none: {
    name: "None (Solid)",
    description: "Solid colored points with no tabby or agouti markings.",
    geneticBasis: "t^b/t^b (homozygous recessive non-agouti)",
  },
  lynx: {
    name: "Lynx (Tabby)",
    description:
      "Agouti or tabby markings visible on the points. Creates stripes, swirls, or spots on the face, ears, and legs. Very striking and wild appearance.",
    geneticBasis:
      "T^a/_ (at least one T^a allele for agouti). Creates the distinctive tabby overlay.",
  },
};

export function getOverlayInfo(overlayName: string): OverlayInfo | undefined {
  return OVERLAYS[overlayName];
}

export function getAllOverlays(): string[] {
  return Object.keys(OVERLAYS);
}

/**
 * Human-readable summary of the genetic basis for a pattern
 */
export function describePattern(pattern: string): string {
  const info = getPatternInfo(pattern);
  return info ? `${info.name}: ${info.description}` : "Unknown pattern";
}
