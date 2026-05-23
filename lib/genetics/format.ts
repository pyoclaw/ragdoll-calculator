import { OffspringProbability } from "@/lib/genetics/types";

export function formatOffspringForExport(offspring: OffspringProbability[]): string {
  return offspring
    .map(
      ({ phenotype, probability }) =>
        `${phenotype.color} ${phenotype.pattern}${phenotype.overlay === "lynx" ? " (Lynx)" : ""} - ${phenotype.sex === "male" ? "♂ Male" : "♀ Female"}: ${(probability * 100).toFixed(1)}%`
    )
    .join("\n");
}

