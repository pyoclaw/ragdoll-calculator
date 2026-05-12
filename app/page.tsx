"use client";

import Link from "next/link";

/**
 * Render the landing page for Ragdoll Breeder Tools, providing navigation and access to the app's main utilities.
 *
 * Renders a hero section with primary navigation links, a features grid linking to the Color & Pattern Reference, Genetics Calculator, and Litter Planner, an informational section explaining Ragdoll genetics, and a getting-started checklist.
 *
 * @returns The landing page's JSX element.
 */
export default function Home() {
  const features = [
    {
      title: "Color & Pattern Reference",
      description:
        "Explore all Ragdoll colors and patterns with genetic information.",
      href: "/reference",
      icon: "🎨",
    },
    {
      title: "Genetics Calculator",
      description: "Calculate offspring probabilities from two parent genotypes.",
      href: "/genetics",
      icon: "🧬",
    },
    {
      title: "Litter Planner",
      description: "Plan potential litters by selecting parent colors and patterns.",
      href: "/litter-planner",
      icon: "👨‍👩‍👧",
    },
  ];

  return (
    <main className="flex flex-col flex-1">
      {/* Hero section */}
      <section className="bg-gradient-to-r from-blue-50 to-purple-50 py-16">
        <div className="container mx-auto px-4 max-w-4xl">
          <div className="text-center">
            <h1 className="text-5xl font-bold text-gray-900 mb-4">
              Ragdoll Breeder Tools
            </h1>
            <p className="text-xl text-gray-700 mb-8">
              Understand Ragdoll genetics and plan responsible litters with
              confidence
            </p>
            <div className="flex gap-4 justify-center flex-wrap">
              <Link
                href="/reference"
                className="px-6 py-3 bg-blue-600 text-white rounded-lg font-semibold hover:bg-blue-700 transition"
              >
                View Color Reference
              </Link>
              <Link
                href="/genetics"
                className="px-6 py-3 bg-purple-600 text-white rounded-lg font-semibold hover:bg-purple-700 transition"
              >
                Start Calculator
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Features section */}
      <section className="py-16">
        <div className="container mx-auto px-4 max-w-4xl">
          <h2 className="text-3xl font-bold text-gray-900 mb-12 text-center">
            Tools for Breeding Success
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {features.map((feature, idx) => (
              <Link
                key={idx}
                href={feature.href}
                className="bg-white border border-gray-200 rounded-lg p-6 hover:shadow-lg transition-shadow hover:border-blue-300"
              >
                <div className="text-4xl mb-4">{feature.icon}</div>
                <h3 className="text-xl font-bold text-gray-900 mb-2">
                  {feature.title}
                </h3>
                <p className="text-gray-700 text-sm">{feature.description}</p>
                <div className="mt-4 text-blue-600 font-semibold text-sm">
                  Explore →
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Info section */}
      <section className="bg-gray-50 py-16">
        <div className="container mx-auto px-4 max-w-4xl">
          <h2 className="text-3xl font-bold text-gray-900 mb-8">
            Why Understand Ragdoll Genetics?
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div>
              <h3 className="text-xl font-semibold text-gray-900 mb-3">
                Responsible Breeding
              </h3>
              <p className="text-gray-700">
                Understanding genetic inheritance helps breeders make informed
                decisions and maintain healthy bloodlines. Use our tools to
                predict offspring outcomes and plan strategic crosses.
              </p>
            </div>
            <div>
              <h3 className="text-xl font-semibold text-gray-900 mb-3">
                Ragdoll-Specific
              </h3>
              <p className="text-gray-700">
                This tool is built specifically for Ragdoll cats, accounting for
                the key loci that determine their beautiful colors and patterns:
                seal, chocolate, blue, lilac, red, cream, and more.
              </p>
            </div>
            <div>
              <h3 className="text-xl font-semibold text-gray-900 mb-3">
                Simple Yet Complete
              </h3>
              <p className="text-gray-700">
                Our genetics calculator uses Punnett square logic to accurately
                predict offspring probabilities across multiple genetic loci,
                including X-linked traits.
              </p>
            </div>
            <div>
              <h3 className="text-xl font-semibold text-gray-900 mb-3">
                Free & Accessible
              </h3>
              <p className="text-gray-700">
                Built for breeders by enthusiasts, these tools are free to use
                and don't require registration. Your data stays private and is
                never stored on our servers.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Getting started section */}
      <section className="py-16">
        <div className="container mx-auto px-4 max-w-4xl">
          <h2 className="text-3xl font-bold text-gray-900 mb-8">
            Getting Started
          </h2>
          <div className="bg-white border border-gray-200 rounded-lg p-8">
            <ol className="space-y-4 text-gray-700">
              <li className="flex gap-4">
                <span className="flex-shrink-0 w-8 h-8 bg-blue-600 text-white rounded-full flex items-center justify-center font-bold">
                  1
                </span>
                <div>
                  <strong>Explore the Reference:</strong> Start by viewing all
                  Ragdoll colors and patterns. Learn how genetics creates each
                  phenotype.
                </div>
              </li>
              <li className="flex gap-4">
                <span className="flex-shrink-0 w-8 h-8 bg-blue-600 text-white rounded-full flex items-center justify-center font-bold">
                  2
                </span>
                <div>
                  <strong>Select Parental Genotypes:</strong> In the Calculator,
                  choose the genetic makeup of your male and female Ragdoll
                  parents.
                </div>
              </li>
              <li className="flex gap-4">
                <span className="flex-shrink-0 w-8 h-8 bg-blue-600 text-white rounded-full flex items-center justify-center font-bold">
                  3
                </span>
                <div>
                  <strong>View Predicted Offspring:</strong> See probabilities
                  for all possible color and pattern combinations in the
                  offspring.
                </div>
              </li>
              <li className="flex gap-4">
                <span className="flex-shrink-0 w-8 h-8 bg-blue-600 text-white rounded-full flex items-center justify-center font-bold">
                  4
                </span>
                <div>
                  <strong>Plan Your Next Litter:</strong> Use the Litter Planner
                  for a simplified interface if you prefer selecting colors over
                  genotypes.
                </div>
              </li>
            </ol>
          </div>
        </div>
      </section>
    </main>
  );
}
