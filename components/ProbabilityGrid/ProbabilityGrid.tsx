"use client";

/**
 * ProbabilityGrid component - displays offspring probabilities in a table
 */

import React from "react";
import { OffspringProbability } from "@/lib/genetics/types";
import { CatCard } from "@/components/CatCard/CatCard";

interface ProbabilityGridProps {
  offspring: OffspringProbability[];
  title?: string;
  showDetails?: boolean;
}

export function ProbabilityGrid({
  offspring,
  title = "Predicted Offspring",
  showDetails = false,
}: ProbabilityGridProps) {
  if (offspring.length === 0) {
    return (
      <div className="p-6 border rounded-lg bg-gray-50">
        <p className="text-gray-600">No offspring data available</p>
      </div>
    );
  }

  // Group by color for summary
  const colorSummary = new Map<string, number>();
  const patternSummary = new Map<string, number>();

  for (const { phenotype, probability } of offspring) {
    colorSummary.set(
      phenotype.color,
      (colorSummary.get(phenotype.color) || 0) + probability
    );
    patternSummary.set(
      phenotype.pattern,
      (patternSummary.get(phenotype.pattern) || 0) + probability
    );
  }

  return (
    <div className="space-y-6">
      {/* Summary section */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Color distribution */}
        <div className="border rounded-lg p-4 bg-white">
          <h3 className="font-bold text-lg mb-3">By Color</h3>
          <div className="space-y-2">
            {Array.from(colorSummary.entries())
              .sort((a, b) => b[1] - a[1])
              .map(([color, probability]) => (
                <div key={color} className="flex items-center justify-between">
                  <span className="capitalize font-medium">{color}</span>
                  <div className="flex items-center gap-2">
                    <div className="w-32 bg-gray-200 rounded-full h-2">
                      <div
                        className="bg-blue-500 h-2 rounded-full transition-all"
                        style={{ width: `${probability * 100}%` }}
                      />
                    </div>
                    <span className="text-sm font-semibold w-12 text-right">
                      {(probability * 100).toFixed(1)}%
                    </span>
                  </div>
                </div>
              ))}
          </div>
        </div>

        {/* Pattern distribution */}
        <div className="border rounded-lg p-4 bg-white">
          <h3 className="font-bold text-lg mb-3">By Pattern</h3>
          <div className="space-y-2">
            {Array.from(patternSummary.entries())
              .sort((a, b) => b[1] - a[1])
              .map(([pattern, probability]) => (
                <div key={pattern} className="flex items-center justify-between">
                  <span className="capitalize font-medium">{pattern}</span>
                  <div className="flex items-center gap-2">
                    <div className="w-32 bg-gray-200 rounded-full h-2">
                      <div
                        className="bg-green-500 h-2 rounded-full transition-all"
                        style={{ width: `${probability * 100}%` }}
                      />
                    </div>
                    <span className="text-sm font-semibold w-12 text-right">
                      {(probability * 100).toFixed(1)}%
                    </span>
                  </div>
                </div>
              ))}
          </div>
        </div>
      </div>

      {/* Detailed offspring grid */}
      {showDetails && (
        <div>
          <h3 className="font-bold text-lg mb-4">{title}</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {offspring.map((item, idx) => (
              <CatCard
                key={idx}
                phenotype={item.phenotype}
                probability={item.probability}
                showSex={true}
              />
            ))}
          </div>
        </div>
      )}

      {/* Data table option for detailed view */}
      {!showDetails && offspring.length > 0 && (
        <div className="text-center text-sm text-gray-600">
          {offspring.length} different phenotype combinations predicted
        </div>
      )}
    </div>
  );
}
