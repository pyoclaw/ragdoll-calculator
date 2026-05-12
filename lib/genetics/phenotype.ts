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
 * Derives the coat color from the B, D and O loci while accounting for the animal's sex.
 *
 * The function treats B alleles with dominance order B > b > b_l, D as dense (D) vs dilute (d),
 * and O as an X-linked red allele that produces sex-dependent red/cream or tortoiseshell/blue-cream
 * expression. The genotype must include loci B, D and O.
 *
 * @param genotype - Genotype object containing loci `B`, `D`, and `O`
 * @param sex - `"male"` or `"female"`, which affects O-locus expression
 * @returns One of: `"red"`, `"cream"`, `"tortoiseshell"`, `"blue-cream"`, `"seal"`, `"blue"`, `"chocolate"`, `"lilac"`, `"cinnamon"`, or `"fawn"`
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
 * Determine the coat pattern from the genotype's Wg and S loci.
 *
 * @param genotype - Genotype object containing Wg and S loci used to infer pattern
 * @returns `"bicolor"` if an `S` allele is present, `"mitted"` if Wg is heterozygous containing `w_g` and `+`, otherwise `"colorpoint"`
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
 * Determine the overlay phenotype based on the Ta (agouti/tabby) locus.
 *
 * @returns `"lynx"` if the Ta alleles include `T^a`, `"none"` otherwise.
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
 * Convert a complete genotype into a phenotype object.
 *
 * @param genotype - Genotype containing the loci required to derive color, pattern, and overlay
 * @param sex - Individual's sex; influences color determination for the O locus
 * @returns Phenotype containing `color`, `pattern`, `overlay`, and `sex`
 * @throws Error when any required locus (B, D, O, Cs, Wg, S, Ta) is missing from `genotype`
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
 * Format a phenotype into a human-readable string.
 *
 * Capitalizes the color and pattern names. If `overlay` is `"lynx"`, returns
 * `"<Color> Point <Pattern> Lynx"`; otherwise returns `"<Color> <Pattern>"`.
 *
 * @param phenotype - Object containing `color`, `pattern`, and `overlay`
 * @returns The formatted phenotype string, e.g. `"Seal Point Lynx"` or `"Blue Mitted"`
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
