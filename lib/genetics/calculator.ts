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
 * Produce all distinct haploid gametes from a parent genotype, taking parental sex into account.
 *
 * For autosomal loci each allele present is emitted as a separate gamete possibility.
 * For X-linked loci, a male parent contributes the single (hemizygous) X allele and a female parent contributes each X allele as separate possibilities.
 * Each returned Gamete includes an `alleles` map (locus → allele) and a `frequency` representing the probability of that gamete (normalized over all combinations).
 *
 * @param genotype - Mapping of locus names to allele tuples (e.g., `[allele0]` or `[allele0, allele1]`)
 * @param sex - Parent sex which determines X-linked locus behavior
 * @returns An array of Gamete objects with `alleles` and their normalized `frequency` (probability)
 */
function generateGametes(genotype: Genotype, sex: Sex): Gamete[] {
  const loci = Object.keys(genotype).sort();
  const gametes: Map<string, number> = new Map();

  /**
   * Builds every possible haploid allele combination for the provided genotype and sex and records their counts.
   *
   * This function advances through sorted loci starting at `locusIndex`, appending an allele choice for each locus
   * to `currentAlleles`. For X-linked loci it treats males as hemizygous (only `allele0`) and females as diploid
   * (both allele possibilities if present). Each complete allele map is stringified and used to increment a count
   * in the enclosing `gametes` map.
   *
   * @param locusIndex - Index of the locus to process next in the sorted locus list
   * @param currentAlleles - Partial mapping of locus names to selected alleles for the current recursion path
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
    const allele0 = alleles[0]!;
    const allele1 = alleles[1];

    if (X_LINKED_LOCI.has(locus)) {
      // X-linked locus
      if (sex === "male") {
        // Males have only one X allele (hemizygous)
        currentAlleles[locus] = allele0;
        recurse(locusIndex + 1, currentAlleles);
      } else {
        // Females have two X alleles (diploid)
        currentAlleles[locus] = allele0;
        recurse(locusIndex + 1, { ...currentAlleles });
        if (allele1) {
          currentAlleles[locus] = allele1;
          recurse(locusIndex + 1, { ...currentAlleles });
        }
      }
    } else {
      // Autosomal locus
      currentAlleles[locus] = allele0;
      recurse(locusIndex + 1, { ...currentAlleles });
      if (allele1) {
        currentAlleles[locus] = allele1;
        recurse(locusIndex + 1, { ...currentAlleles });
      }
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
 * Merge two haploid gametes into a diploid offspring genotype.
 *
 * Each locus present in either gamete becomes a two-allele entry in the returned genotype.
 *
 * @param gamete1 - Gamete contributed by the first parent
 * @param gamete2 - Gamete contributed by the second parent
 * @param parent1Sex - Sex of the first parent (accepted but not used by this function)
 * @param parent2Sex - Sex of the second parent (accepted but not used by this function)
 * @returns A Genotype mapping each locus to a two-element allele tuple representing the offspring's alleles
 * @throws Error if either gamete is missing an allele for a locus (including X-linked loci)
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
 * Determine offspring sex based on whether the second parent's gamete carries a Y chromosome.
 *
 * @param gamete2HasY - Whether the second parent's gamete contains a Y chromosome
 * @returns `"male"` if `gamete2HasY` is `true`, `"female"` otherwise
 */
function getOffspringSex(parent1Sex: Sex, parent2Sex: Sex, gamete2HasY: boolean): Sex {
  // Parent 1 (female) provides X; Parent 2 (male) provides X or Y
  return gamete2HasY ? "male" : "female";
}

/**
 * Compute the probability distribution of offspring phenotypes produced by two parents.
 *
 * @param parent1Genotype - Genotype of the first parent.
 * @param parent2Genotype - Genotype of the second parent.
 * @param parent1Sex - Sex of the first parent; affects gamete generation for X-linked loci. Defaults to `"female"`.
 * @param parent2Sex - Sex of the second parent; affects gamete generation for X-linked loci. Defaults to `"male"`.
 * @returns An array of phenotypes with their probabilities (each probability rounded to 4 decimals), sorted in descending order by probability.
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
 * Compute all possible offspring phenotypes and their probabilities from a cross between two parent genotypes.
 *
 * @param parent1Genotype - Genotype of the first parent
 * @param parent2Genotype - Genotype of the second parent
 * @returns An array of offspring phenotype probability entries; each entry contains a `phenotype` and its `probability` (probabilities are rounded to four decimals)
 */
export function getAllPossiblePhenotypes(
  parent1Genotype: Genotype,
  parent2Genotype: Genotype
): OffspringProbability[] {
  return cross(parent1Genotype, parent2Genotype);
}

/**
 * Aggregate total probability for each phenotype color from a list of offspring outcomes.
 *
 * @param offspring - Array of offspring probability objects to aggregate
 * @returns A map from phenotype `color` to the summed probability for that color
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
 * Aggregates offspring probabilities by phenotype pattern.
 *
 * @param offspring - List of offspring probability entries to summarize
 * @returns A map where each key is a phenotype `pattern` and each value is the total probability for that pattern
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
