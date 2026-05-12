"use client";

import React, { useState } from "react";
import { CatCard } from "@/components/CatCard/CatCard";
import { ProbabilityGrid } from "@/components/ProbabilityGrid/ProbabilityGrid";
import { cross } from "@/lib/genetics/calculator";
import {
  Genotype,
  OffspringProbability,
  Color,
  Pattern,
} from "@/lib/genetics/types";
import { getAllColors } from "@/lib/data/colors";
import { getAllPatterns } from "@/lib/data/patterns";
import { genotypeToPhenotype } from "@/lib/genetics/phenotype";

/**
 * Render the Litter Planner page allowing users to choose two parents' colors and patterns and view predicted offspring probabilities.
 *
 * The component infers simplified parental genotypes from selected phenotypes, performs a genetic cross, and displays calculated offspring probability results.
 *
 * @returns The React element containing parent selection UI, previews, the "Plan Litter" action, and a conditional results grid showing predicted litter outcomes.
 */
export default function LitterPlannerPage() {
  const colors = getAllColors();
  const patterns = getAllPatterns();

  const [parent1Color, setParent1Color] = useState<Color>("seal");
  const [parent1Pattern, setParent1Pattern] = useState<Pattern>("colorpoint");
  const [parent2Color, setParent2Color] = useState<Color>("blue");
  const [parent2Pattern, setParent2Pattern] = useState<Pattern>("colorpoint");

  const [offspring, setOffspring] = useState<OffspringProbability[]>([]);
  const [showResults, setShowResults] = useState(false);

  // Simple genotype inference from phenotype
  // This is a simplification - in reality you might need more info
  const inferGenotype = (color: Color, pattern: Pattern): Genotype => {
    const getColorAlleles = (color: Color): [string, string] => {
      switch (color) {
        case "seal":
          return ["B", "B"];
        case "chocolate":
          return ["b", "b"];
        case "blue":
          return ["B", "B"];
        case "lilac":
          return ["b", "b"];
        case "cinnamon":
          return ["b_l", "b_l"];
        case "fawn":
          return ["b_l", "b_l"];
        case "red":
        case "cream":
        case "tortoiseshell":
        case "blue-cream":
          return ["b", "b"]; // conservative
        default:
          return ["B", "B"];
      }
    };

    const getDensityAlleles = (color: Color): [string, string] => {
      switch (color) {
        case "seal":
        case "chocolate":
        case "cinnamon":
        case "red":
        case "tortoiseshell":
          return ["D", "D"];
        case "blue":
        case "lilac":
        case "fawn":
        case "cream":
        case "blue-cream":
          return ["d", "d"];
        default:
          return ["D", "D"];
      }
    };

    const getOAlleles = (color: Color): [string, string] => {
      switch (color) {
        case "red":
        case "tortoiseshell":
          return ["O", "o"];
        case "cream":
        case "blue-cream":
          return ["O", "o"];
        default:
          return ["o", "o"];
      }
    };

    const getPatternAlleles = (pattern: Pattern): {
      Wg: [string, string];
      S: [string, string];
    } => {
      if (pattern === "bicolor") {
        return {
          Wg: ["+", "+"],
          S: ["S", "S"],
        };
      } else if (pattern === "mitted") {
        return {
          Wg: ["w_g", "+"],
          S: ["s", "s"],
        };
      } else {
        // colorpoint
        return {
          Wg: ["w_g", "w_g"],
          S: ["s", "s"],
        };
      }
    };

    const patternAlleles = getPatternAlleles(pattern);

    return {
      B: getColorAlleles(color),
      D: getDensityAlleles(color),
      O: getOAlleles(color),
      Cs: ["cs", "cs"],
      Wg: patternAlleles.Wg,
      S: patternAlleles.S,
      Ta: ["t^b", "t^b"], // default to non-lynx for simplicity
    };
  };

  const handlePlan = () => {
    try {
      const parent1Genotype = inferGenotype(parent1Color, parent1Pattern);
      const parent2Genotype = inferGenotype(parent2Color, parent2Pattern);

      const results = cross(parent1Genotype, parent2Genotype, "female", "male");
      setOffspring(results);
      setShowResults(true);
    } catch (error) {
      console.error("Error planning litter:", error);
      alert("Error planning litter. Please try different selections.");
    }
  };

  return (
    <main className="container mx-auto px-4 py-8">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-4xl font-bold mb-2 text-gray-900">Litter Planner</h1>
        <p className="text-gray-600 mb-8">
          Plan your next litter by simply selecting parent colors and patterns.
          The system will estimate likely genotypes and predict offspring.
        </p>

        {/* Parent selection panels */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
          {/* Parent 1 (Female) */}
          <div className="bg-white border border-gray-200 rounded-lg p-6 shadow-md">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">
              Parent 1 ♀ (Female)
            </h2>

            <div className="space-y-6">
              {/* Color selection */}
              <div>
                <label className="block font-semibold text-gray-800 mb-3">
                  Color
                </label>
                <div className="grid grid-cols-2 gap-2">
                  {colors.map((color) => (
                    <button
                      key={color}
                      onClick={() => setParent1Color(color as Color)}
                      className={`
                        px-4 py-2 rounded font-medium transition capitalize
                        ${
                          parent1Color === color
                            ? "bg-blue-600 text-white border-2 border-blue-700"
                            : "bg-gray-100 text-gray-800 hover:bg-gray-200"
                        }
                      `}
                    >
                      {color}
                    </button>
                  ))}
                </div>
              </div>

              {/* Pattern selection */}
              <div>
                <label className="block font-semibold text-gray-800 mb-3">
                  Pattern
                </label>
                <div className="flex gap-2">
                  {patterns.map((pattern) => (
                    <button
                      key={pattern}
                      onClick={() => setParent1Pattern(pattern as Pattern)}
                      className={`
                        px-4 py-2 rounded font-medium transition capitalize flex-1
                        ${
                          parent1Pattern === pattern
                            ? "bg-purple-600 text-white border-2 border-purple-700"
                            : "bg-gray-100 text-gray-800 hover:bg-gray-200"
                        }
                      `}
                    >
                      {pattern}
                    </button>
                  ))}
                </div>
              </div>

              {/* Preview */}
              <div className="mt-6 pt-6 border-t">
                <p className="text-sm text-gray-600 mb-2">Preview</p>
                <CatCard
                  phenotype={{
                    color: parent1Color,
                    pattern: parent1Pattern,
                    overlay: "none",
                    sex: "female",
                  }}
                />
              </div>
            </div>
          </div>

          {/* Parent 2 (Male) */}
          <div className="bg-white border border-gray-200 rounded-lg p-6 shadow-md">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">
              Parent 2 ♂ (Male)
            </h2>

            <div className="space-y-6">
              {/* Color selection */}
              <div>
                <label className="block font-semibold text-gray-800 mb-3">
                  Color
                </label>
                <div className="grid grid-cols-2 gap-2">
                  {colors.map((color) => (
                    <button
                      key={color}
                      onClick={() => setParent2Color(color as Color)}
                      className={`
                        px-4 py-2 rounded font-medium transition capitalize
                        ${
                          parent2Color === color
                            ? "bg-blue-600 text-white border-2 border-blue-700"
                            : "bg-gray-100 text-gray-800 hover:bg-gray-200"
                        }
                      `}
                    >
                      {color}
                    </button>
                  ))}
                </div>
              </div>

              {/* Pattern selection */}
              <div>
                <label className="block font-semibold text-gray-800 mb-3">
                  Pattern
                </label>
                <div className="flex gap-2">
                  {patterns.map((pattern) => (
                    <button
                      key={pattern}
                      onClick={() => setParent2Pattern(pattern as Pattern)}
                      className={`
                        px-4 py-2 rounded font-medium transition capitalize flex-1
                        ${
                          parent2Pattern === pattern
                            ? "bg-purple-600 text-white border-2 border-purple-700"
                            : "bg-gray-100 text-gray-800 hover:bg-gray-200"
                        }
                      `}
                    >
                      {pattern}
                    </button>
                  ))}
                </div>
              </div>

              {/* Preview */}
              <div className="mt-6 pt-6 border-t">
                <p className="text-sm text-gray-600 mb-2">Preview</p>
                <CatCard
                  phenotype={{
                    color: parent2Color,
                    pattern: parent2Pattern,
                    overlay: "none",
                    sex: "male",
                  }}
                />
              </div>
            </div>
          </div>
        </div>

        {/* Plan button */}
        <div className="text-center mb-8">
          <button
            onClick={handlePlan}
            className="px-8 py-3 bg-green-600 text-white font-semibold rounded-lg hover:bg-green-700 transition text-lg"
          >
            Plan Litter
          </button>
        </div>

        {/* Results */}
        {showResults && (
          <div className="bg-white border border-gray-200 rounded-lg p-6 shadow-md">
            <ProbabilityGrid
              offspring={offspring}
              title="Predicted Litter Outcomes"
              showDetails={true}
            />
          </div>
        )}

        {/* Info section */}
        <div className="mt-12 bg-blue-50 border border-blue-200 rounded-lg p-6">
          <h3 className="font-bold text-lg text-gray-900 mb-3">
            How Litter Planner Works
          </h3>
          <p className="text-gray-700 mb-4">
            The Litter Planner simplifies the genetics process by letting you
            select phenotypes (colors and patterns) instead of raw genotypes. The
            system estimates likely parental genotypes and predicts offspring.
          </p>
          <p className="text-gray-700">
            <strong>Note:</strong> This is a simplification. For more precise
            predictions, use the full Genetics Calculator if you know the exact
            genotypes of your cats.
          </p>
        </div>
      </div>
    </main>
  );
}
