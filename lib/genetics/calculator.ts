/**
 * Genetics calculator for Ragdoll cats.
 * Implements Punnett square logic for multi-locus crosses.
 */

import {
  Allele,
  Genotype,
  OffspringProbability,
  Phenotype,
  Sex,
} from "./types";
import { validateGenotype, X_LINKED_LOCI } from "./loci";
import { genotypeToPhenotype } from "./phenotype";

/**
 * Represents a possible gamete (haploid contribution) with its frequency.
 */
interface Gamete {
  alleles: Record<string, Allele>;
  frequency: number;
}

/**
 * Generate all possible gametes (haploid genotypes) from a parent genotype.
 * For autosomal loci: 50% each allele.
 * For X-linked loci in females: 50% each allele.
 * For X-linked loci in males: 100% the single allele.
 */
function generateGametes(genotype: Genotype, sex: Sex): Gamete[] {
  const loci = Object.keys(genotype).sort();
  const gametes: Map<string, number> = new Map();

  /**
   * Recursive function to generate all combinations.
   */
  function recurse(locusIndex: number, currentAlleles: Record<string, Allele>) {
    if (locusIndex === loci.length) {
      // Base case: we've assigned alleles for all loci
      const key = JSON.stringify(currentAlleles);
      gametes.set(key, (gametes.get(key) || 0) + 1);
      return;
    }

    const locus = loci[locusIndex];
    const alleles = genotype[locus] as [Allele, Allele] | [Allele];

    if (X_LINKED_LOCI.has(locus)) {
      // X-linked locus
      if (sex === "male") {
        // Males have only one X allele (hemizygous)
        currentAlleles[locus] = alleles[0];
        recurse(locusIndex + 1, currentAlleles);
      } else {
        // Females have two X alleles (diploid)
        currentAlleles[locus] = alleles[0];
        recurse(locusIndex + 1, { ...currentAlleles });
        currentAlleles[locus] = alleles[1];
        recurse(locusIndex + 1, { ...currentAlleles });
      }
    } else {
      // Autosomal locus
      currentAlleles[locus] = alleles[0];
      recurse(locusIndex + 1, { ...currentAlleles });
      currentAlleles[locus] = alleles[1];
      recurse(locusIndex + 1, { ...currentAlleles });
    }
  }

  recurse(0, {});

  // Convert map to array and normalize frequencies
  const totalCombinations = Array.from(gametes.values()).reduce(
    (sum, count) => sum + count,
    0
  );
  const result: Gamete[] = Array.from(gametes.entries()).map(([key, count]) => ({
    alleles: JSON.parse(key),
    frequency: count / totalCombinations,
  }));

  return result;
}

/**
 * Combine two gametes (one from each parent) into an offspring genotype.
 */
function combineGametes(
  gamete1: Gamete,
  gamete2: Gamete,
  parent1Sex: Sex,
  parent2Sex: Sex
): Genotype {
  const offspring: Genotype = {};
  const allLoci = new Set([
    ...Object.keys(gamete1.alleles),
    ...Object.keys(gamete2.alleles),
  ]);

  for (const locus of allLoci) {
    const allele1 = gamete1.alleles[locus];
    const allele2 = gamete2.alleles[locus];

    if (X_LINKED_LOCI.has(locus)) {
      // X-linked: first parent contributes X, second contributes X or Y
      if (!allele1 || !allele2) {
        throw new Error(`Missing allele at X-linked locus ${locus}`);
      }
      offspring[locus] = [allele1, allele2] as [Allele, Allele];
    } else {
      // Autosomal: both parents contribute one allele
      if (!allele1 || !allele2) {
        throw new Error(`Missing allele at autosomal locus ${locus}`);
      }
      offspring[locus] = [allele1, allele2] as [Allele, Allele];
    }
  }

  return offspring;
}

/**
 * Determine the sex of offspring from parental sexes.
 * Parent 1 provides the egg (always X); parent 2 provides sperm (X or Y).
 * By convention, parent 1 is always female.
 */
function getOffspringSex(parent1Sex: Sex, parent2Sex: Sex, gamete2HasY: boolean): Sex {
  // Parent 1 (female) provides X; Parent 2 (male) provides X or Y
  return gamete2HasY ? "male" : "female";
}

/**
 * Main genetics calculator: compute all possible offspring from two parents.
 *
 * Returns an array of phenotypes with their probabilities.
 * Assumes parent1 is female and parent2 is male (for correct X-linked inheritance).
 */
export function cross(
  parent1Genotype: Genotype,
  parent2Genotype: Genotype,
  parent1Sex: Sex = "female",
  parent2Sex: Sex = "male"
): OffspringProbability[] {
  // Validate input genotypes
  validateGenotype(parent1Genotype);
  validateGenotype(parent2Genotype);

  // Generate gametes from each parent
  const gametes1 = generateGametes(parent1Genotype, parent1Sex);
  const gametes2 = generateGametes(parent2Genotype, parent2Sex);

  // Create offspring genotypes and phenotypes with probabilities
  const offspringMap: Map<string, number> = new Map();
  const phenotypeMap: Map<string, Phenotype> = new Map();

  for (const g1 of gametes1) {
    for (const g2 of gametes2) {
      const offspringGenotype = combineGametes(
        g1,
        g2,
        parent1Sex,
        parent2Sex
      );

      // Determine offspring sex - roughly 50/50 male/female
      // For X-linked traits, sex matters, so we create both
      // For purely autosomal traits, sex doesn't affect phenotype in these tests

      for (const offspringSex of ["male", "female"] as Sex[]) {
        const phenotype = genotypeToPhenotype(offspringGenotype, offspringSex);
        const phenotypeKey = JSON.stringify(phenotype);

        // Each gamete combination produces 50% males and 50% females
        const probability = (g1.frequency * g2.frequency) / 2;

        offspringMap.set(
          phenotypeKey,
          (offspringMap.get(phenotypeKey) || 0) + probability
        );
        phenotypeMap.set(phenotypeKey, phenotype);
      }
    }
  }

  // Convert results to array and sort by probability (descending)
  const results: OffspringProbability[] = Array.from(offspringMap.entries())
    .map(([key, probability]) => ({
      phenotype: phenotypeMap.get(key)!,
      probability: Math.round(probability * 10000) / 10000, // Round to 4 decimals
    }))
    .sort((a, b) => b.probability - a.probability);

  return results;
}

/**
 * Helper function to get all possible phenotypes from a Punnett cross.
 * Useful for examining the full genetic outcome space.
 */
export function getAllPossiblePhenotypes(
  parent1Genotype: Genotype,
  parent2Genotype: Genotype
): OffspringProbability[] {
  return cross(parent1Genotype, parent2Genotype);
}

/**
 * Helper to summarize offspring probabilities by color.
 */
export function summarizeByColor(
  offspring: OffspringProbability[]
): Map<string, number> {
  const colorMap = new Map<string, number>();
  for (const { phenotype, probability } of offspring) {
    const existing = colorMap.get(phenotype.color) || 0;
    colorMap.set(phenotype.color, existing + probability);
  }
  return colorMap;
}

/**
 * Helper to summarize offspring probabilities by pattern.
 */
export function summarizeByPattern(
  offspring: OffspringProbability[]
): Map<string, number> {
  const patternMap = new Map<string, number>();
  for (const { phenotype, probability } of offspring) {
    const existing = patternMap.get(phenotype.pattern) || 0;
    patternMap.set(phenotype.pattern, existing + probability);
  }
  return patternMap;
}
