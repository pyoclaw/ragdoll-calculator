"use client";

/**
 * GenotypeBuilder component - form to build/select a genotype
 */

import React, { useState } from "react";
import { Genotype, Sex } from "@/lib/genetics/types";
import { ALLELE_DOMINANCE } from "@/lib/genetics/loci";

interface GenotypeBuilderProps {
  initialGenotype?: Genotype;
  sex: Sex;
  onGenotypeChange: (genotype: Genotype) => void;
  title?: string;
}

/**
 * Render a genotype builder UI that lets users select alleles for a set of loci and notifies the parent of updates.
 *
 * This component maintains local genotype state (initialized from `initialGenotype` or a sex-dependent default),
 * renders selectors for each locus, and calls `onGenotypeChange` whenever the genotype changes.
 *
 * @param initialGenotype - Optional starting genotype to populate the selectors
 * @param sex - Sex value used to determine X-linked behavior; when `"male"`, the `O` locus is hemizygous (single selector)
 * @param onGenotypeChange - Callback invoked with the updated genotype object whenever any allele selection changes
 * @param title - Optional UI title displayed at the top of the card (defaults to `"Build Genotype"`)
 * @returns The rendered React element for the genotype builder
 */
export function GenotypeBuilder({
  initialGenotype,
  sex,
  onGenotypeChange,
  title = "Build Genotype",
}: GenotypeBuilderProps) {
  const loci = [
    { name: "B", alleles: ["B", "b", "b_l"] },
    { name: "D", alleles: ["D", "d"] },
    { name: "O", alleles: ["O", "o"] },
    { name: "Cs", alleles: ["cs"] },
    { name: "Wg", alleles: ["w_g", "+"] },
    { name: "S", alleles: ["S", "s"] },
    { name: "Ta", alleles: ["T^a", "t^b"] },
  ];

  // Initialize state from prop or create default
  const [genotype, setGenotype] = useState<Genotype>(
    initialGenotype || {
      B: ["B", "B"],
      D: ["D", "D"],
      O: sex === "male" ? ["O"] : ["O", "o"],
      Cs: ["cs", "cs"],
      Wg: ["+", "+"],
      S: ["s", "s"],
      Ta: ["t^b", "t^b"],
    }
  );

  const handleAlleleChange = (
    locusName: string,
    position: number,
    newAllele: string
  ) => {
    const currentAlleles = genotype[locusName];
    const updatedAlleles = [...currentAlleles];
    updatedAlleles[position] = newAllele;

    const updated = {
      ...genotype,
      [locusName]: updatedAlleles as any,
    };

    setGenotype(updated);
    onGenotypeChange(updated);
  };

  return (
    <div className="border rounded-lg p-6 bg-white shadow-md">
      <h2 className="text-xl font-bold mb-4">{title}</h2>

      <div className="space-y-4">
        {loci.map((locus) => {
          const alleles = genotype[locus.name] || [];
          const isXLinked = locus.name === "O";
          const isMale = sex === "male" && isXLinked;

          return (
            <div key={locus.name} className="border-b pb-4">
              <label className="block font-semibold text-gray-800 mb-2">
                {locus.name} Locus
                {isXLinked && " (X-linked)"}
              </label>

              {/* Display available alleles for this locus */}
              <div className="flex gap-2 items-center flex-wrap">
                {isMale ? (
                  // Male: X-linked, hemizygous (1 allele)
                  <select
                    value={alleles[0] || ""}
                    onChange={(e) =>
                      handleAlleleChange(locus.name, 0, e.target.value)
                    }
                    className="px-3 py-2 border rounded bg-blue-50"
                  >
                    {locus.alleles.map((a) => (
                      <option key={a} value={a}>
                        {a}
                      </option>
                    ))}
                  </select>
                ) : (
                  // Female: diploid (2 alleles)
                  <>
                    <select
                      value={alleles[0] || ""}
                      onChange={(e) =>
                        handleAlleleChange(locus.name, 0, e.target.value)
                      }
                      className="px-3 py-2 border rounded bg-blue-50"
                    >
                      {locus.alleles.map((a) => (
                        <option key={a} value={a}>
                          {a}
                        </option>
                      ))}
                    </select>
                    <span className="text-gray-500">/</span>
                    <select
                      value={alleles[1] || ""}
                      onChange={(e) =>
                        handleAlleleChange(locus.name, 1, e.target.value)
                      }
                      className="px-3 py-2 border rounded bg-blue-50"
                    >
                      {locus.alleles.map((a) => (
                        <option key={a} value={a}>
                          {a}
                        </option>
                      ))}
                    </select>
                  </>
                )}

                {/* Display alleles */}
                <span className="text-gray-600 text-sm ml-2">
                  Alleles available: {locus.alleles.join(", ")}
                </span>
              </div>
            </div>
          );
        })}
      </div>

      <div className="mt-6 p-4 bg-gray-50 rounded border-l-4 border-blue-400">
        <p className="text-sm text-gray-700">
          <strong>Current Genotype:</strong>
        </p>
        <code className="text-xs text-gray-800 font-mono break-all">
          {Object.entries(genotype)
            .map(([locus, alleles]) => `${locus}: ${alleles.join("/")}`)
            .join(" | ")}
        </code>
      </div>
    </div>
  );
}
