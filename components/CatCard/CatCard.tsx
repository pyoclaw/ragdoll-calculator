"use client";

/**
 * CatCard component - displays a cat's phenotype with color swatch and genotype info
 */

import React from "react";
import { Phenotype } from "@/lib/genetics/types";
import { phenotypeToString } from "@/lib/genetics/phenotype";
import { getColorInfo } from "@/lib/data/colors";

interface CatCardProps {
  phenotype: Phenotype;
  probability?: number; // If provided, shows as a percentage
  onClick?: () => void;
  className?: string;
  showSex?: boolean;
}

export function CatCard({
  phenotype,
  probability,
  onClick,
  className = "",
  showSex = false,
}: CatCardProps) {
  const colorInfo = getColorInfo(phenotype.color);
  const displayName = phenotypeToString(phenotype);
  const percentageText =
    probability && probability > 0
      ? `${(probability * 100).toFixed(1)}%`
      : undefined;

  return (
    <div
      onClick={onClick}
      className={`
        biocolor border rounded-lg overflow-hidden shadow-md hover:shadow-lg
        transition-shadow cursor-pointer
        ${onClick ? "hover:scale-105 transition-transform" : ""}
        ${className}
      `}
    >
      {/* Color swatch */}
      <div
        className="h-24 w-full transition-opacity hover:opacity-90"
        style={{
          backgroundColor: colorInfo?.hexColor || "#999",
        }}
      />

      {/* Info section */}
      <div className="p-4 bg-white">
        <h3 className="font-semibold text-lg mb-1">{displayName}</h3>

        {showSex && (
          <p className="text-sm text-gray-600 mb-2 capitalize">
            {phenotype.sex === "male" ? "♂ Male" : "♀ Female"}
          </p>
        )}

        {colorInfo && (
          <p className="text-sm text-gray-700">{colorInfo.name}</p>
        )}

        <div className="flex items-baseline justify-between mt-3">
          <span className="text-xs text-gray-500 capitalize">
            {phenotype.pattern}
            {phenotype.overlay === "lynx" && " • Lynx"}
          </span>
          {percentageText && (
            <span className="text-lg font-bold text-blue-600">
              {percentageText}
            </span>
          )}
        </div>
      </div>
    </div>
  );
}
