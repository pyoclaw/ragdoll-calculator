# Ragdoll Breeder Tools - Development Guide

A complete genetics calculator and breeding management system for Ragdoll cat breeders. Built with Next.js 15, TypeScript, Tailwind CSS, and powered by Supabase PostgreSQL.

## 🎯 Project Overview

This application helps Ragdoll breeders:
- **Understand Genetics**: Interactive calculator showing Punnett square logic across 7 key loci
- **Plan Litters**: Predict offspring color and pattern probabilities
- **Manage Records**: Save crosses, track litter outcomes, and maintain genetic records
- **Reference Data**: Complete color/pattern encyclopedia with genetic basis

## 🏗️ Architecture

### Tech Stack
- **Framework**: Next.js 15 with App Router
- **Language**: TypeScript
- **Styling**: Tailwind CSS + shadcn/ui patterns
- **State Management**: Zustand (for future features)
- **Database**: Supabase PostgreSQL with Drizzle ORM
- **Testing**: Vitest
- **Auth**: Supabase Auth via @supabase/server

### Key Modules

```
src/lib/genetics/
├── types.ts              # Core genetics types (Genotype, Phenotype, etc.)
├── loci.ts               # Locus definitions and allele dominance
├── calculator.ts         # Punnett square calculation engine
├── phenotype.ts          # Genotype → Phenotype mapping
└── __tests__/            # 34 passing unit tests

lib/db/
├── schema.ts             # Drizzle ORM schema (users, cats, crosses, litters)
└── client.ts             # Supabase client initialization

app/
├── page.tsx              # Landing page with features
├── reference/page.tsx    # Color/pattern encyclopedia
├── genetics/page.tsx     # Main genetics calculator
├── litter-planner/       # Simplified UI for planning
└── api/genetics/         # REST endpoint for calculations
```

## 🚀 Getting Started

### Prerequisites
- Node.js 18+ and npm
- Supabase account (free tier available)

### Local Development

1. **Clone and install**:
   ```bash
   git clone <repo>
   cd ragdoll-breeder-tools
   npm install
   ```

2. **Set up environment**:
   ```bash
   cp .env.example .env.local
   # Fill in Supabase credentials
   ```

3. **Run development server**:
   ```bash
   npm run dev
   ```
   Open http://localhost:3000

4. **Run tests**:
   ```bash
   npm run test:run
   ```

### Database Setup

See [SUPABASE_SETUP.md](./SUPABASE_SETUP.md) for complete Supabase configuration.

Quick start:
```bash
# Generate migrations from schema
npm run db:generate

# Apply migrations to your Supabase database
npm run db:migrate

# Or use Drizzle Studio to manage database
npm run db:studio
```

## 📚 Core Features

### 1. Genetics Calculator (`/genetics`)
- Select parental genotypes for 7 Ragdoll loci
- Real-time offspring probability calculation
- Results grouped by color and pattern
- Export/copy functionality

**Supported Loci**:
- **B**: Black/Brown/Cinnamon (B > b > b_l)
- **D**: Dense/Dilute (D > d)
- **O**: Orange/Red (X-linked)
- **Cs**: Color-Point (all Ragdolls cs/cs)
- **Wg**: White Glove/Mitted
- **S**: Spotting/Bicolor
- **Ta**: Tabby/Lynx Overlay

### 2. Litter Planner (`/litter-planner`)
- Simplified UI: select colors and patterns instead of genotypes
- System infers likely parental genotypes
- Shows predicted offspring probabilities
- Great for breeders unfamiliar with genetics notation

### 3. Reference Encyclopedia (`/reference`)
- Visual showcase of all color/pattern combinations
- Genetic basis for each phenotype
- Inheritance rules and dominance hierarchy
- Educational resource

### 4. REST API (`/api/genetics`)
- POST endpoint for calculation requests
- Full CORS support
- Request body: `{ parent1: Genotype, parent2: Genotype }`
- Response: array of `OffspringProbability` objects

## 🧬 Genetics Engine

### How It Works

The calculator uses **Punnett square logic** across multiple loci:

1. **Gamete Generation**: Creates all possible haploid contributions from each parent
2. **Combination**: Crosses gametes to create offspring genotypes
3. **Phenotype Mapping**: Converts genotypes to observable colors/patterns
4. **Probabilities**: Groups identical phenotypes and calculates frequencies

### Example

```typescript
// Parent 1 (Female Seal):  B/B, D/D, o/o
// Parent 2 (Male Blue):    B/B, d/d, o/o

cross(parent1Genotype, parent2Genotype);
// Returns: 50% Seal (D/d dense), 50% Blue (d/d dilute)
```

### Tested Outcomes

All 34 unit tests verify:
- ✅ Basic Mendelian inheritance
- ✅ X-linked trait expression
- ✅ Multi-locus independent assortment
- ✅ Probability calculation accuracy
- ✅ Phenotype prediction correctness

## 🗄️ Database Schema

Tables for complete breeding management:

- **users**: Breeder accounts
- **cats**: Registered cats with genotypes
- **crosses**: Planned breeding pairs
- **litters**: Actual offspring results
- **calculations**: Cached calculation results
- **breeding_records**: Individual kitten records

See `lib/db/schema.ts` for full Drizzle schema.

## 🛠️ Development Workflow

### Building Components

Pages are Next.js App Router components with "use client" directives for interactivity:

```typescript
"use client";

export default function MyPage() {
  const [genotype, setGenotype] = useState<Genotype>(...);
  // Component code
}
```

### Adding New Loci

1. Add to `loci.ts` ALLELE_DOMINANCE map
2. Update `types.ts` Color/Pattern unions if phenotype changed
3. Update phenotype mapping in `phenotype.ts`
4. Add test cases in `__tests__/`

### Database Operations

Use Drizzle ORM for database queries:

```typescript
import { db } from "@/lib/db";
import { cats, crosses } from "@/lib/db/schema";

// Get a cat
const myCat = await db.select().from(cats)
  .where(eq(cats.id, catId))
  .limit(1);
```

## 📊 Build & Deployment

### Local Build
```bash
npm run build
npm run start
```

### TypeScript Check
```bash
npm run lint
```

### Deployment to Vercel

1. Push code to GitHub
2. Import repo in Vercel
3. Set environment variables in Vercel dashboard
4. Deploy (automatic on main branch)

**Important**: Vercel needs these env vars:
- All `NEXT_PUBLIC_*` variables (public)
- `SUPABASE_SERVICE_ROLE_KEY` (secret)
- `DATABASE_URL` (secret)

## 🎓 Learning Resources

### Genetics Concepts
- [Mendelian Inheritance](https://en.wikipedia.org/wiki/Mendelian_inheritance)
- [Punnett Squares](https://en.wikipedia.org/wiki/Punnett_square)
- [X-linked Traits](https://en.wikipedia.org/wiki/X-linked_inheritance)
- [Ragdoll Breed Standard](https://www.tica.org/)

### Technical Stack
- [Next.js 15 Docs](https://nextjs.org/docs)
- [Drizzle ORM](https://orm.drizzle.team)
- [Supabase](https://supabase.com/docs)
- [Tailwind CSS](https://tailwindcss.com/docs)

## 📝 Future Enhancements

Planned features for v2:

- [ ] User authentication and profiles
- [ ] Save/load genetic crosses
- [ ] Historical breeding data analysis
- [ ] Export breeding reports as PDF
- [ ] Integration with TICA/breed registries
- [ ] Mobile app version
- [ ] Multi-language support
- [ ] Advanced pedigree builder

## 🐛 Troubleshooting

### Build Errors
- Clear `.next/` directory: `rm -rf .next`
- Reinstall dependencies: `rm -rf node_modules && npm install`

### Database Connection Issues
- Verify DATABASE_URL is correct with URL-encoded special characters
- Check Supabase project is running
- Ensure your IP isn't blocked by network firewall

### Tests Failing
- Run `npm run test:run` for full output
- Check genetics engine wasn't modified incorrectly
- Verify all genotypes have required loci

## 📄 License

This project is provided as-is for educational and commercial use in cat breeding.

## 🤝 Contributing

To contribute improvements:

1. Create feature branch: `git checkout -b feature/your-feature`
2. Make changes and test
3. Commit with descriptive message
4. Push and create pull request

## 📞 Support

For issues or questions:
- Check the Supabase troubleshooting in `SUPABASE_SETUP.md`
- Review test files for usage examples
- Check component props documentation

---

**Built with ❤️ for Ragdoll breeders**
