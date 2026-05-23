"use client";

import React, { useState } from "react";
import { CatCard } from "@/components/CatCard/CatCard";
import { getAllColors } from "@/lib/data/colors";
import { getAllOverlays, getAllPatterns } from "@/lib/data/patterns";
import { buildReferencePhenotypes, filterReferencePhenotypes, ReferenceFilter } from "@/lib/genetics/reference";

/**
 * Render the Ragdoll Color & Pattern Reference page showing every color and pattern combination.
 *
 * The page includes explanatory sections about colors, patterns, overlays, and genetic inheritance,
 * and a responsive grid that renders a CatCard for each generated phenotype (both "none" and
 * "lynx" overlay variants for every color/pattern pair).
 *
 * @returns A React element containing the complete reference page layout and the grid of CatCard components.
 */
export default function ReferencePage() {
  const colors = getAllColors();
  const patterns = getAllPatterns();
  const overlays = getAllOverlays();
  const [filter, setFilter] = useState<ReferenceFilter>({ color: "all", pattern: "all", overlay: "all" });

  const allPhenotypes = buildReferencePhenotypes();
  const phenotypes = filterReferencePhenotypes(allPhenotypes, filter);

  return (
    <main className="container mx-auto px-4 py-8">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-4xl font-bold mb-2 text-gray-900">
          Ragdoll Color & Pattern Reference
        </h1>
        <p className="text-gray-600 mb-8">
          Explore the complete range of Ragdoll cat colors and patterns, from
          seal and chocolate to rare blue-cream.
        </p>

        {/* Filter section */}
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-6 mb-8">
          <h2 className="text-xl font-semibold mb-4 text-gray-900">
            Understanding Ragdoll Colors & Patterns
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div>
              <h3 className="font-bold text-gray-900 mb-2">Colors</h3>
              <p className="text-sm text-gray-700">
                Determined by the B (brown/chocolate) and D (dense/dilute) loci.
                Red and cream are X-linked, appearing in males or as
                tortoiseshell in heterozygous females.
              </p>
            </div>
            <div>
              <h3 className="font-bold text-gray-900 mb-2">Patterns</h3>
              <p className="text-sm text-gray-700">
                <strong>Colorpoint:</strong> Classic dark points, no white.
                <br />
                <strong>Mitted:</strong> Points + white paws and chin.
                <br />
                <strong>Bicolor (Van):</strong> Points + extensive white body.
              </p>
            </div>
            <div>
              <h3 className="font-bold text-gray-900 mb-2">Overlays</h3>
              <p className="text-sm text-gray-700">
                <strong>Solid:</strong> No pattern on the points.
                <br />
                <strong>Lynx:</strong> Tabby/agouti stripes and markings on the
                points.
              </p>
            </div>
          </div>
          <div className="mt-5 grid grid-cols-1 md:grid-cols-3 gap-3">
            <select className="rounded border px-3 py-2 bg-white" value={filter.color ?? "all"} onChange={(event) => setFilter((prev) => ({ ...prev, color: event.target.value as ReferenceFilter["color"] }))}>
              <option value="all">All colors</option>
              {colors.map((color) => <option key={color} value={color}>{color}</option>)}
            </select>
            <select className="rounded border px-3 py-2 bg-white" value={filter.pattern ?? "all"} onChange={(event) => setFilter((prev) => ({ ...prev, pattern: event.target.value as ReferenceFilter["pattern"] }))}>
              <option value="all">All patterns</option>
              {patterns.map((pattern) => <option key={pattern} value={pattern}>{pattern}</option>)}
            </select>
            <select className="rounded border px-3 py-2 bg-white" value={filter.overlay ?? "all"} onChange={(event) => setFilter((prev) => ({ ...prev, overlay: event.target.value as ReferenceFilter["overlay"] }))}>
              <option value="all">All overlays</option>
              {overlays.map((overlay) => <option key={overlay} value={overlay}>{overlay}</option>)}
            </select>
          </div>
        </div>

        {/* Grid of all combinations */}
        <div>
          <h2 className="text-2xl font-bold mb-6 text-gray-900">All Color & Pattern Combinations ({phenotypes.length})</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
            {phenotypes.map((phenotype, idx) => (
              <CatCard
                key={idx}
                phenotype={phenotype}
                showSex={false}
                className="h-full"
              />
            ))}
          </div>
        </div>

        {/* Additional info section */}
        <div className="mt-12 bg-white border rounded-lg p-8">
          <h2 className="text-2xl font-bold mb-4 text-gray-900">
            Genetic Inheritance
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div>
              <h3 className="font-bold text-lg mb-2 text-gray-900">
                Autosomal Loci
              </h3>
              <ul className="space-y-2 text-sm text-gray-700">
                <li>
                  <strong>B locus:</strong> B (black) &gt; b (brown) &gt; b_l
                  (cinnamon)
                </li>
                <li>
                  <strong>D locus:</strong> D (dense) &gt; d (dilute)
                </li>
                <li>
                  <strong>Cs locus:</strong> All Ragdolls are cs/cs (color-point
                  gene)
                </li>
                <li>
                  <strong>Wg locus:</strong> w_g/+ = mitted; w_g/w_g or +/+ =
                  colorpoint
                </li>
                <li>
                  <strong>S locus:</strong> S = piebald spotting (bicolor); s/s
                  = no spotting
                </li>
                <li>
                  <strong>Ta locus:</strong> T^a = lynx/tabby; t^b/t^b = solid
                  points
                </li>
              </ul>
            </div>
            <div>
              <h3 className="font-bold text-lg mb-2 text-gray-900">
                X-Linked Locus
              </h3>
              <ul className="space-y-2 text-sm text-gray-700">
                <li>
                  <strong>O locus:</strong> Orange/red gene (X-linked)
                </li>
                <li>
                  <strong>Males:</strong> X^O/Y = red; X^o/Y = non-red
                </li>
                <li>
                  <strong>Females:</strong> X^O/X^O = red; X^O/X^o = tortie;
                  X^o/X^o = non-red
                </li>
                <li>
                  Dilute gene (d) affects red → cream and tortie → blue-cream
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
