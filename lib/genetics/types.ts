/**
 * Core type definitions for Ragdoll genetics
 * Fully describes genotypes, phenotypes, and inheritance patterns
 */

/**
 * An allele is the specific variant at a locus.
 * Examples: "B" (black), "b" (brown/chocolate), "b_l" (cinnamon), "D" (dense), "d" (dilute)
 */
export type Allele = string;

/**
 * A locus represents a gene with possible alleles and inheritance pattern.
 * All Ragdoll loci used are either autosomal (xLinked false/undefined) or X-linked (xLinked true).
 */
export interface Locus {
  name: string;
  /** The two alleles at this locus. Used to define the complete set of possibilities. */
  alleles: [Allele, Allele] | Allele[];
  /** If true, this locus is X-linked (meaningful only for O locus in Ragdolls). */
  xLinked?: boolean;
}

/**
 * A genotype is the complete genetic makeup at one or more loci.
 * Keyed by locus name, each value is a tuple of two alleles (or one for hemizygous males at X-linked loci).
 */
export type Genotype = Record<string, [Allele, Allele] | [Allele]>;

/**
 * Valid Ragdoll color phenotypes.
 * Determined by B (brown/chocolate/cinnamon) and D (dense/dilute) loci.
 * O locus (red/cream) is handled separately for sex-specific expression.
 */
export type Color =
  | "seal"           // B_, D_ (dense black)
  | "chocolate"      // bb, D_ (dense brown)
  | "blue"           // B_, dd (dilute black)
  | "lilac"          // bb, dd (dilute brown)
  | "red"            // Male with O allele on X
  | "cream"          // Dilute red
  | "cinnamon"       // b_l b_, D_
  | "fawn"           // b_l b_, dd
  | "tortoiseshell"  // Female with both B and O alleles
  | "blue-cream";    // Female with both b and O alleles

/**
 * Valid Ragdoll point patterns.
 * colorpoint: Siamese-style points (no white)
 * mitted: Points with white paws (gloved)
 * bicolor: Points with much white (van-like)
 */
export type Pattern =
  | "colorpoint"
  | "mitted"
  | "bicolor";

/**
 * Overlay on top of the color + pattern combination.
 * lynx: Tabby markings on the points
 * none: No overlay (solid points)
 */
export type Overlay =
  | "lynx"
  | "none";

/**
 * Biological sex of the cat.
 * Relevant for X-linked traits (O locus for red/cream colors).
 */
export type Sex = "male" | "female";

/**
 * A phenotype is the observable characteristics of a cat.
 * Includes color, pattern, overlay, and sex.
 */
export interface Phenotype {
  color: Color;
  pattern: Pattern;
  overlay: Overlay;
  sex: Sex;
}

/**
 * Represents the probability of a specific phenotype appearing in offspring.
 */
export interface OffspringProbability {
  phenotype: Phenotype;
  probability: number; // 0.0 to 1.0
}

/**
 * The key Ragdoll loci and their allele systems.
 * B locus: brown vs. chocolate vs. cinnamon
 * D locus: dense vs. dilute
 * O locus: red/orange (X-linked, expressed in males or heterozygous females as tortie)
 * Cs locus: color-point (sepia/mink) — all Ragdolls are homozygous cs/cs
 * Wg locus: white gloves/mitted pattern (w_g, +)
 * S locus: piebald spotting (S, s) — bicolor pattern
 * Ta locus: agouti (tabby/lynx) — present as T^a or t^b
 */
export const RAGDOLL_LOCI: Record<string, Locus> = {
  B: {
    name: "B",
    alleles: ["B", "b", "b_l"], // black > brown > cinnamon
  },
  D: {
    name: "D",
    alleles: ["D", "d"],
  },
  O: {
    name: "O",
    alleles: ["O", "o"],
    xLinked: true, // X-linked
  },
  Cs: {
    name: "Cs",
    alleles: ["cs", "cs"], // All Ragdolls are homozygous for color-point gene
  },
  Wg: {
    name: "Wg",
    alleles: ["w_g", "+"], // white glove allele or wild-type
  },
  S: {
    name: "S",
    alleles: ["S", "s"],
  },
  Ta: {
    name: "Ta",
    alleles: ["T^a", "t^b"], // agouti (dominant in lynx) vs non-agouti
  },
};

/**
 * Example cat genotype with all known loci.
 * Structure: { "B": ["B", "b"], "D": ["D", "d"], ... }
 */
export const DEFAULT_GENOTYPE: Genotype = {
  B: ["B", "b"],
  D: ["D", "d"],
  O: ["O"], // male example (hemizygous)
  Cs: ["cs", "cs"],
  Wg: ["w_g", "+"],
  S: ["S", "s"],
  Ta: ["T^a", "t^b"],
};
