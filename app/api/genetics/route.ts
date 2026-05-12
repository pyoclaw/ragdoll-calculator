/**
 * API endpoint for genetics calculations
 * POST /api/genetics
 *
 * Request body:
 * {
 *   parent1: { B: ["B", "B"], D: ["D", "D"], ... },
 *   parent2: { B: ["b", "b"], D: ["d", "d"], ... }
 * }
 *
 * Response:
 * {
 *   success: true,
 *   offspring: [
 *     { phenotype: { color, pattern, overlay, sex }, probability: 0.25 },
 *     ...
 *   ]
 * }
 */

import { NextRequest, NextResponse } from "next/server";
import { cross } from "@/lib/genetics/calculator";
import { Genotype, OffspringProbability } from "@/lib/genetics/types";
import { validateGenotype } from "@/lib/genetics/loci";

interface GeneticsRequest {
  parent1: Genotype;
  parent2: Genotype;
  parent1Sex?: string;
  parent2Sex?: string;
}

interface GeneticsResponse {
  success: boolean;
  offspring?: OffspringProbability[];
  error?: string;
}

export async function POST(request: NextRequest): Promise<NextResponse<GeneticsResponse>> {
  try {
    const body = await request.json() as GeneticsRequest;

    // Validate request
    if (!body.parent1 || !body.parent2) {
      return NextResponse.json(
        { success: false, error: "Missing parent1 or parent2 genotype" },
        { status: 400 }
      );
    }

    // Validate genotypes
    try {
      validateGenotype(body.parent1);
      validateGenotype(body.parent2);
    } catch (error) {
      return NextResponse.json(
        {
          success: false,
          error: `Invalid genotype: ${error instanceof Error ? error.message : "unknown error"}`,
        },
        { status: 400 }
      );
    }

    // Perform calculation
    const offspring = cross(
      body.parent1,
      body.parent2,
      (body.parent1Sex === "male" ? "male" : "female"),
      (body.parent2Sex === "female" ? "female" : "male")
    );

    return NextResponse.json({
      success: true,
      offspring,
    });
  } catch (error) {
    console.error("Error in genetics API:", error);
    return NextResponse.json(
      {
        success: false,
        error: `Server error: ${error instanceof Error ? error.message : "unknown error"}`,
      },
      { status: 500 }
    );
  }
}

// Support OPTIONS for CORS
export async function OPTIONS(): Promise<NextResponse> {
  return NextResponse.json({}, {
    headers: {
      "Access-Control-Allow-Origin": "*",
      "Access-Control-Allow-Methods": "POST, OPTIONS",
      "Access-Control-Allow-Headers": "Content-Type",
    },
  });
}
