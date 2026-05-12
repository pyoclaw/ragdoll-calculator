/**
 * Unit tests for the POST /api/genetics and OPTIONS /api/genetics route handlers.
 */

import { describe, it, expect, vi, beforeEach } from "vitest";
import { NextRequest } from "next/server";
import { POST, OPTIONS } from "../route";

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

/** Build a NextRequest with a JSON body and the given HTTP method. */
function makeRequest(body: unknown, method = "POST"): NextRequest {
  return new NextRequest("http://localhost/api/genetics", {
    method,
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
  });
}

/** A minimal valid genotype for a female (all seven loci present). */
const validFemaleGenotype = {
  B: ["B", "B"],
  D: ["D", "D"],
  O: ["o", "o"],
  Cs: ["cs", "cs"],
  Wg: ["+", "+"],
  S: ["s", "s"],
  Ta: ["t^b", "t^b"],
};

/** A minimal valid genotype for a male (hemizygous O locus). */
const validMaleGenotype = {
  B: ["B", "B"],
  D: ["D", "D"],
  O: ["o"],
  Cs: ["cs", "cs"],
  Wg: ["+", "+"],
  S: ["s", "s"],
  Ta: ["t^b", "t^b"],
};

// ---------------------------------------------------------------------------
// POST handler
// ---------------------------------------------------------------------------

describe("POST /api/genetics", () => {
  it("returns 400 when parent1 is missing", async () => {
    const req = makeRequest({ parent2: validMaleGenotype });
    const res = await POST(req);

    expect(res.status).toBe(400);
    const json = await res.json();
    expect(json.success).toBe(false);
    expect(json.error).toMatch(/Missing parent1 or parent2/);
  });

  it("returns 400 when parent2 is missing", async () => {
    const req = makeRequest({ parent1: validFemaleGenotype });
    const res = await POST(req);

    expect(res.status).toBe(400);
    const json = await res.json();
    expect(json.success).toBe(false);
    expect(json.error).toMatch(/Missing parent1 or parent2/);
  });

  it("returns 400 when both parents are missing", async () => {
    const req = makeRequest({});
    const res = await POST(req);

    expect(res.status).toBe(400);
    const json = await res.json();
    expect(json.success).toBe(false);
    expect(json.error).toMatch(/Missing parent1 or parent2/);
  });

  it("returns 400 when parent1 contains an invalid allele", async () => {
    const badParent1 = {
      ...validFemaleGenotype,
      B: ["X", "Y"], // Invalid alleles for B locus
    };
    const req = makeRequest({ parent1: badParent1, parent2: validMaleGenotype });
    const res = await POST(req);

    expect(res.status).toBe(400);
    const json = await res.json();
    expect(json.success).toBe(false);
    expect(json.error).toMatch(/Invalid genotype/);
  });

  it("returns 400 when parent2 contains an invalid allele", async () => {
    const badParent2 = {
      ...validMaleGenotype,
      D: ["bad_allele"], // Invalid allele for D locus
    };
    const req = makeRequest({ parent1: validFemaleGenotype, parent2: badParent2 });
    const res = await POST(req);

    expect(res.status).toBe(400);
    const json = await res.json();
    expect(json.success).toBe(false);
    expect(json.error).toMatch(/Invalid genotype/);
  });

  it("returns 400 when a genotype contains an unknown locus", async () => {
    const badParent = {
      ...validFemaleGenotype,
      UNKNOWN_LOCUS: ["A", "B"],
    };
    const req = makeRequest({ parent1: badParent, parent2: validMaleGenotype });
    const res = await POST(req);

    expect(res.status).toBe(400);
    const json = await res.json();
    expect(json.success).toBe(false);
    expect(json.error).toMatch(/Invalid genotype/);
  });

  it("returns 400 when an X-linked locus has more than 2 alleles", async () => {
    const badParent = {
      ...validFemaleGenotype,
      O: ["O", "o", "O"], // 3 alleles for X-linked locus
    };
    const req = makeRequest({ parent1: badParent, parent2: validMaleGenotype });
    const res = await POST(req);

    expect(res.status).toBe(400);
    const json = await res.json();
    expect(json.success).toBe(false);
    expect(json.error).toMatch(/Invalid genotype/);
  });

  it("returns 200 with offspring array for valid homozygous seal × seal cross", async () => {
    const req = makeRequest({
      parent1: validFemaleGenotype,
      parent2: validMaleGenotype,
    });
    const res = await POST(req);

    expect(res.status).toBe(200);
    const json = await res.json();
    expect(json.success).toBe(true);
    expect(Array.isArray(json.offspring)).toBe(true);
    expect(json.offspring.length).toBeGreaterThan(0);
  });

  it("offspring probabilities sum to 1.0 for a valid cross", async () => {
    const req = makeRequest({
      parent1: validFemaleGenotype,
      parent2: validMaleGenotype,
    });
    const res = await POST(req);
    const json = await res.json();

    const total: number = json.offspring.reduce(
      (sum: number, item: { probability: number }) => sum + item.probability,
      0
    );
    expect(total).toBeCloseTo(1.0, 2);
  });

  it("each offspring entry has the expected shape", async () => {
    const req = makeRequest({
      parent1: validFemaleGenotype,
      parent2: validMaleGenotype,
    });
    const res = await POST(req);
    const json = await res.json();

    for (const item of json.offspring) {
      expect(typeof item.probability).toBe("number");
      expect(item.probability).toBeGreaterThan(0);
      expect(item.probability).toBeLessThanOrEqual(1);
      expect(item.phenotype).toBeDefined();
      expect(typeof item.phenotype.color).toBe("string");
      expect(typeof item.phenotype.pattern).toBe("string");
      expect(["none", "lynx"]).toContain(item.phenotype.overlay);
      expect(["male", "female"]).toContain(item.phenotype.sex);
    }
  });

  it("correctly defaults parent1 to female when parent1Sex is omitted", async () => {
    // A homozygous seal female × male produces seal offspring of both sexes
    const req = makeRequest({
      parent1: validFemaleGenotype,
      parent2: validMaleGenotype,
    });
    const res = await POST(req);
    const json = await res.json();

    const sexes = new Set(
      json.offspring.map((o: { phenotype: { sex: string } }) => o.phenotype.sex)
    );
    // With default sex assignment, we should see both male and female offspring
    expect(sexes.has("male")).toBe(true);
    expect(sexes.has("female")).toBe(true);
  });

  it("treats parent1 as male when parent1Sex='male'", async () => {
    // Supply a hemizygous O genotype for the male
    const maleGenotype = {
      B: ["B", "B"],
      D: ["D", "D"],
      O: ["O"], // hemizygous male
      Cs: ["cs", "cs"],
      Wg: ["+", "+"],
      S: ["s", "s"],
      Ta: ["t^b", "t^b"],
    };
    const femaleGenotype = {
      ...validFemaleGenotype,
      O: ["o", "o"],
    };

    const req = makeRequest({
      parent1: maleGenotype,
      parent1Sex: "male",
      parent2: femaleGenotype,
      parent2Sex: "female",
    });
    const res = await POST(req);

    expect(res.status).toBe(200);
    const json = await res.json();
    expect(json.success).toBe(true);
    expect(json.offspring.length).toBeGreaterThan(0);
  });

  it("returns 400 for malformed (non-JSON) request body", async () => {
    const req = new NextRequest("http://localhost/api/genetics", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: "this is not json{{{",
    });
    const res = await POST(req);

    expect(res.status).toBe(400);
    const json = await res.json();
    expect(json.success).toBe(false);
    expect(json.error).toMatch(/invalid json|bad request|malformed/i);
  });

  it("handles a heterozygous cross and returns multiple phenotypes", async () => {
    const parent1 = {
      B: ["B", "b"],
      D: ["D", "d"],
      O: ["o", "o"],
      Cs: ["cs", "cs"],
      Wg: ["w_g", "+"],
      S: ["S", "s"],
      Ta: ["T^a", "t^b"],
    };
    const parent2 = {
      B: ["b", "b"],
      D: ["D", "d"],
      O: ["o"],
      Cs: ["cs", "cs"],
      Wg: ["+", "+"],
      S: ["S", "s"],
      Ta: ["T^a", "t^b"],
    };

    const req = makeRequest({ parent1, parent2 });
    const res = await POST(req);

    expect(res.status).toBe(200);
    const json = await res.json();
    expect(json.offspring.length).toBeGreaterThan(1);

    const total = json.offspring.reduce(
      (s: number, o: { probability: number }) => s + o.probability,
      0
    );
    expect(total).toBeCloseTo(1.0, 2);
  });
});

// ---------------------------------------------------------------------------
// OPTIONS handler (CORS preflight)
// ---------------------------------------------------------------------------

describe("OPTIONS /api/genetics", () => {
  it("returns 200 status", async () => {
    const res = await OPTIONS();
    expect(res.status).toBe(200);
  });

  it("includes Access-Control-Allow-Origin: *", async () => {
    const res = await OPTIONS();
    expect(res.headers.get("Access-Control-Allow-Origin")).toBe("*");
  });

  it("includes Access-Control-Allow-Methods with POST and OPTIONS", async () => {
    const res = await OPTIONS();
    const methods = res.headers.get("Access-Control-Allow-Methods") ?? "";
    expect(methods).toContain("POST");
    expect(methods).toContain("OPTIONS");
  });

  it("includes Access-Control-Allow-Headers with Content-Type", async () => {
    const res = await OPTIONS();
    const headers = res.headers.get("Access-Control-Allow-Headers") ?? "";
    expect(headers).toContain("Content-Type");
  });

  it("returns an empty JSON body", async () => {
    const res = await OPTIONS();
    const json = await res.json();
    expect(json).toEqual({});
  });
});