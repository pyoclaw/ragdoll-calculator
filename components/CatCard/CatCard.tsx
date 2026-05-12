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

/**
 * Renders a card displaying a cat phenotype: color swatch, computed display name, pattern/overlay text,
 * optional sex label, and an optional probability percentage; the card becomes interactive when `onClick` is provided.
 *
 * @param phenotype - Phenotype data used to compute display name, color swatch, sex, pattern, and overlay.
 * @param probability - Optional probability (0–1). When > 0, shown as a percentage with one decimal place.
 * @param onClick - Optional click handler; when provided the card receives hover/scale styling.
 * @param className - Optional additional CSS classes applied to the outer card container.
 * @param showSex - When true, displays a male/female label derived from `phenotype.sex`.
 * @returns The rendered JSX element representing the cat card.
 */
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
