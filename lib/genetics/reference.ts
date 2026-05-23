import { getAllColors } from "@/lib/data/colors";
import { getAllPatterns, getAllOverlays } from "@/lib/data/patterns";
import { Overlay, Pattern, Phenotype, PhenotypeColor, Sex } from "@/lib/genetics/types";

const DEFAULT_SEX_SEQUENCE: Sex[] = ["female", "male"];

export interface ReferenceFilter {
  color?: PhenotypeColor | "all";
  pattern?: Pattern | "all";
  overlay?: Overlay | "all";
}

export function buildReferencePhenotypes(sexSequence: Sex[] = DEFAULT_SEX_SEQUENCE): Phenotype[] {
  const colors = getAllColors() as PhenotypeColor[];
  const patterns = getAllPatterns() as Pattern[];
  const overlays = getAllOverlays() as Overlay[];
  const phenotypes: Phenotype[] = [];

  let index = 0;
  for (const color of colors) {
    for (const pattern of patterns) {
      for (const overlay of overlays) {
        phenotypes.push({
          color,
          pattern,
          overlay,
          sex: sexSequence[index % sexSequence.length],
        });
        index += 1;
      }
    }
  }

  return phenotypes;
}

export function filterReferencePhenotypes(phenotypes: Phenotype[], filter: ReferenceFilter): Phenotype[] {
  return phenotypes.filter((phenotype) => {
    const colorMatch = !filter.color || filter.color === "all" || phenotype.color === filter.color;
    const patternMatch = !filter.pattern || filter.pattern === "all" || phenotype.pattern === filter.pattern;
    const overlayMatch = !filter.overlay || filter.overlay === "all" || phenotype.overlay === filter.overlay;
    return colorMatch && patternMatch && overlayMatch;
  });
}

