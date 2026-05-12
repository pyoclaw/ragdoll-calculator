"use client";

import React, { useState } from "react";
import { GenotypeBuilder } from "@/components/GenotypeBuilder/GenotypeBuilder";
import { ProbabilityGrid } from "@/components/ProbabilityGrid/ProbabilityGrid";
import { cross } from "@/lib/genetics/calculator";
import { Genotype, OffspringProbability } from "@/lib/genetics/types";

/**
 * Page component for selecting two Ragdoll parent genotypes and calculating predicted offspring phenotype probabilities.
 *
 * Renders two genotype builders (female and male), a calculate action that runs a genetic cross, and a results area
 * showing predicted offspring phenotype probabilities with copy and print actions.
 *
 * @returns The rendered page element containing genotype selection panels, calculate controls, and the offspring results UI.
 */
export default function GeneticsPage() {
  const [parent1Genotype, setParent1Genotype] = useState<Genotype>({
    B: ["B", "B"],
    D: ["D", "D"],
    O: ["O", "o"],
    Cs: ["cs", "cs"],
    Wg: ["w_g", "+"],
    S: ["S", "s"],
    Ta: ["T^a", "t^b"],
  });

  const [parent2Genotype, setParent2Genotype] = useState<Genotype>({
    B: ["b", "b"],
    D: ["d", "d"],
    O: ["o"],
    Cs: ["cs", "cs"],
    Wg: ["+", "+"],
    S: ["s", "s"],
    Ta: ["t^b", "t^b"],
  });

  const [offspring, setOffspring] = useState<OffspringProbability[]>([]);
  const [showResults, setShowResults] = useState(false);

  // Calculate offspring when parents change
  const handleCalculate = () => {
    try {
      const results = cross(parent1Genotype, parent2Genotype, "female", "male");
      setOffspring(results);
      setShowResults(true);
    } catch (error) {
      console.error("Error calculating offspring:", error);
      alert(
        "Error calculating offspring. Please check your genotype selections."
      );
    }
  };

  return (
    <main className="container mx-auto px-4 py-8">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-4xl font-bold mb-2 text-gray-900">
          Genetics Calculator
        </h1>
        <p className="text-gray-600 mb-8">
          Select genotypes for both parents and calculate predicted offspring
          probabilities. The calculator uses Punnett square logic across all
          seven key Ragdoll loci.
        </p>

        {/* Two-panel layout for parents */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          <GenotypeBuilder
            initialGenotype={parent1Genotype}
            sex="female"
            onGenotypeChange={setParent1Genotype}
            title="Parent 1 (♀ Female)"
          />
          <GenotypeBuilder
            initialGenotype={parent2Genotype}
            sex="male"
            onGenotypeChange={setParent2Genotype}
            title="Parent 2 (♂ Male)"
          />
        </div>

        {/* Calculate button */}
        <div className="text-center mb-8">
          <button
            onClick={handleCalculate}
            className="px-8 py-3 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 transition text-lg"
          >
            Calculate Offspring
          </button>
        </div>

        {/* Results section */}
        {showResults && (
          <div className="bg-white border border-gray-200 rounded-lg p-6 shadow-md">
            <ProbabilityGrid
              offspring={offspring}
              title="Predicted Offspring Phenotypes"
              showDetails={true}
            />

            {/* Export option */}
            <div className="mt-8 pt-8 border-t flex gap-4 justify-center">
              <button
                onClick={() => {
                  const text = offspring
                    .map(
                      (o) =>
                        `${o.phenotype.color} ${o.phenotype.pattern}${o.phenotype.overlay === "lynx" ? " (Lynx)" : ""} - ${o.phenotype.sex === "male" ? "♂ Male" : "♀ Female"}: ${(o.probability * 100).toFixed(1)}%`
                    )
                    .join("\n");
                  navigator.clipboard.writeText(text);
                  alert("Results copied to clipboard!");
                }}
                className="px-4 py-2 bg-gray-600 text-white rounded hover:bg-gray-700 transition"
              >
                📋 Copy Results
              </button>
              <button
                onClick={() => window.print()}
                className="px-4 py-2 bg-gray-600 text-white rounded hover:bg-gray-700 transition"
              >
                🖨️ Print
              </button>
            </div>
          </div>
        )}

        {/* Info section */}
        <div className="mt-12 grid grid-cols-1 md:grid-cols-2 gap-8">
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-6">
            <h3 className="font-bold text-lg text-gray-900 mb-3">
              How It Works
            </h3>
            <ul className="text-sm text-gray-700 space-y-2">
              <li>✓ Each parent contributes one allele per locus</li>
              <li>✓ X-linked loci (O) handled correctly for males and females</li>
              <li>✓ Probabilities calculated using Punnett square logic</li>
              <li>✓ Results include all phenotype combinations</li>
              <li>✓ Grouped by color and pattern for easy interpretation</li>
            </ul>
          </div>

          <div className="bg-purple-50 border border-purple-200 rounded-lg p-6">
            <h3 className="font-bold text-lg text-gray-900 mb-3">
              Supported Loci
            </h3>
            <ul className="text-sm text-gray-700 space-y-2">
              <li>
                <strong>B:</strong> Black/Brown/Cinnamon (B &gt; b &gt; b_l)
              </li>
              <li>
                <strong>D:</strong> Dense/Dilute (D &gt; d)
              </li>
              <li>
                <strong>O:</strong> Orange/Red (X-linked)
              </li>
              <li>
                <strong>Cs:</strong> Color-Point (all Ragdolls cs/cs)
              </li>
              <li>
                <strong>Wg:</strong> White Glove / Mitted (w_g vs +)
              </li>
              <li>
                <strong>S:</strong> Spotting / Bicolor (S vs s)
              </li>
              <li>
                <strong>Ta:</strong> Tabby / Lynx (T^a vs t^b)
              </li>
            </ul>
          </div>
        </div>
      </div>
    </main>
  );
}
