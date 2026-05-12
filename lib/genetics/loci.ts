/**
 * Locus definitions, allele rankings (dominance), and validation rules.
 */

import { Allele, Locus, Genotype } from "./types";

/**
 * Dominance hierarchy for each locus.
 * Used in gamete formation and phenotype determination.
 * Higher index = more dominant (recessive is at index 0).
 */
export const ALLELE_DOMINANCE: Record<string, Allele[]> = {
  B: ["b_l", "b", "B"],     // B > b > b_l (black > brown > cinnamon)
  D: ["d", "D"],             // D > d (dominant dense)
  O: ["o", "O"],             // O > o (in heterozygous females, both expressed as tortie)
  Cs: ["cs"],                // All Ragdolls are cs/cs
  Wg: ["+", "w_g"],          // + (wild-type) > w_g (white glove)
  S: ["s", "S"],             // S > s (piebald/white spotting dominant)
  Ta: ["t^b", "T^a"],        // T^a > t^b (agouti dominant in marking)
};

/**
 * Valid allele combinations for each locus.
 * Used for validation before genetic calculations.
 */
export const VALID_ALLELES: Record<string, Set<Allele>> = {
  B: new Set(["B", "b", "b_l"]),
  D: new Set(["D", "d"]),
  O: new Set(["O", "o"]),
  Cs: new Set(["cs"]),
  Wg: new Set(["w_g", "+"]),
  S: new Set(["S", "s"]),
  Ta: new Set(["T^a", "t^b"]),
};

/**
 * Map a locus name to its X-linked status.
 */
export const X_LINKED_LOCI = new Set(["O"]);

/**
 * Validate that a genotype contains only valid alleles at each locus.
 * Throws if invalid.
 */
export function validateGenotype(genotype: Genotype): void {
  for (const [locusName, alleles] of Object.entries(genotype)) {
    if (!VALID_ALLELES[locusName]) {
      throw new Error(`Unknown locus: ${locusName}`);
    }

    for (const allele of alleles) {
      if (!VALID_ALLELES[locusName].has(allele)) {
        throw new Error(
          `Invalid allele '${allele}' at locus ${locusName}. Valid: ${Array.from(
            VALID_ALLELES[locusName]
          ).join(", ")}`
        );
      }
    }

    // X-linked loci should have only 1 allele in hemizygous males, 2 in females
    if (X_LINKED_LOCI.has(locusName) && alleles.length > 2) {
      throw new Error(`X-linked locus ${locusName} cannot have more than 2 alleles`);
    }
  }
}

/**
 * Get the dominant allele at a locus from a pair.
 * Used in phenotype determination.
 */
export function getDominantAllele(locus: string, alleles: Allele[]): Allele {
  const dominanceOrder = ALLELE_DOMINANCE[locus];
  if (!dominanceOrder) {
    throw new Error(`Unknown locus for dominance: ${locus}`);
  }

  for (let i = dominanceOrder.length - 1; i >= 0; i--) {
    if (alleles.includes(dominanceOrder[i])) {
      return dominanceOrder[i];
    }
  }

  // Fallback: return the first allele if none match dominance order
  return alleles[0];
}

/**
 * Determine if two alleles are homozygous.
 */
export function isHomozygous(alleles: [Allele, Allele] | [Allele]): boolean {
  if (alleles.length === 1) return true; // Hemizygous (X-linked, male)
  return alleles[0] === alleles[1];
}

/**
 * Determine if an allele pair contains a specific allele.
 */
export function hasAllele(
  alleles: [Allele, Allele] | [Allele],
  targetAllele: Allele
): boolean {
  return alleles.includes(targetAllele);
}
