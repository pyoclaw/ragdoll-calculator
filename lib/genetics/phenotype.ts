/**
 * Maps genotypes to phenotypes.
 * Handles all interactions between loci for color, pattern, overlay, and sex.
 */

import {
  Allele,
  Color,
  Genotype,
  Overlay,
  Pattern,
  Phenotype,
  Sex,
} from "./types";
import {
  getDominantAllele,
  hasAllele,
  isHomozygous,
  X_LINKED_LOCI,
} from "./loci";

/**
 * Determine color phenotype from B, D, O loci and sex.
 * Rules:
 * - B locus: B > b > b_l
 * - D locus: D > d (dense > dilute)
 * - O locus: X-linked; affects color in males and expression in heterozygous females
 */
export function genotypeToColor(genotype: Genotype, sex: Sex): Color {
  const bAlleles = genotype.B as [Allele, Allele];
  const dAlleles = genotype.D as [Allele, Allele];
  const oAlleles = genotype.O as [Allele, Allele] | [Allele];

  // Get dominant B allele
  const dominantB = getDominantAllele("B", bAlleles);
  const isDense = hasAllele(dAlleles, "D");

  // Check for red/cream (O allele presence)
  const hasOAllele = hasAllele(oAlleles, "O");

  // Males with O allele are fully red/cream
  if (sex === "male" && hasOAllele) {
    return isDense ? "red" : "cream";
  }

  // Females with O allele and heterozygous at B locus are tortoiseshell
  if (sex === "female" && hasOAllele) {
    if (!isHomozygous(bAlleles)) {
      // Heterozygous B locus with O = tortoiseshell expression
      return isDense ? "tortoiseshell" : "blue-cream";
    }
    // Homozygous recessive b with O = blue-cream (dilute tortoiseshell)
    // This should have been caught earlier, but being explicit
    if (dominantB === "b" && hasOAllele) {
      return isDense ? "tortoiseshell" : "blue-cream";
    }
  }

  // Standard color based on B and D loci
  if (dominantB === "B") {
    return isDense ? "seal" : "blue";
  } else if (dominantB === "b") {
    return isDense ? "chocolate" : "lilac";
  } else if (dominantB === "b_l") {
    return isDense ? "cinnamon" : "fawn";
  }

  // Fallback (should not reach here)
  return "seal";
}

/**
 * Determine pattern phenotype from Wg (white glove) and S (piebald spotting) loci.
 * Rules:
 * - Wg: heterozygous (w_g/+) = mitted pattern
 * - S: at least one S allele = bicolor pattern
 * - Colorpoint: neither condition met
 */
export function genotypeToPattern(genotype: Genotype): Pattern {
  const wgAlleles = genotype.Wg as [Allele, Allele];
  const sAlleles = genotype.S as [Allele, Allele];

  // Check for bicolor (S allele present)
  if (hasAllele(sAlleles, "S")) {
    return "bicolor";
  }

  // Check for mitted (heterozygous at Wg locus: w_g/+)
  if (
    !isHomozygous(wgAlleles) &&
    hasAllele(wgAlleles, "w_g") &&
    hasAllele(wgAlleles, "+")
  ) {
    return "mitted";
  }

  // Default to colorpoint
  return "colorpoint";
}

/**
 * Determine overlay phenotype from Ta (agouti/tabby) locus.
 * Rules:
 * - T^a (agouti) present = lynx overlay
 * - t^b (non-agouti) homozygous = no overlay (solid points)
 */
export function genotypeToOverlay(genotype: Genotype): Overlay {
  const taAlleles = genotype.Ta as [Allele, Allele];

  // If T^a is present, lynx pattern shows
  if (hasAllele(taAlleles, "T^a")) {
    return "lynx";
  }

  return "none";
}

/**
 * Convert a complete genotype to a phenotype.
 * Integrates color, pattern, overlay, and sex.
 */
export function genotypeToPhenotype(genotype: Genotype, sex: Sex): Phenotype {
  // Ensure all required loci are present
  const requiredLoci = ["B", "D", "O", "Cs", "Wg", "S", "Ta"];
  for (const locus of requiredLoci) {
    if (!genotype[locus]) {
      throw new Error(`Missing required locus: ${locus}`);
    }
  }

  return {
    color: genotypeToColor(genotype, sex),
    pattern: genotypeToPattern(genotype),
    overlay: genotypeToOverlay(genotype),
    sex,
  };
}

/**
 * Format a phenotype as a human-readable string.
 * Example: "Seal Point Lynx" or "Blue Mitted"
 */
export function phenotypeToString(phenotype: Phenotype): string {
  const { color, pattern, overlay } = phenotype;

  // Capitalize color
  const capitalColor = color.charAt(0).toUpperCase() + color.slice(1);

  // Pattern name (capitalize first letter)
  const capitalPattern = pattern.charAt(0).toUpperCase() + pattern.slice(1);

  // Construct the name
  if (overlay === "lynx") {
    return `${capitalColor} Point ${capitalPattern} Lynx`;
  }

  return `${capitalColor} ${capitalPattern}`;
}
