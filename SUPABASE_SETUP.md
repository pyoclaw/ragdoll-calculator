# Supabase Setup Guide

This guide walks you through setting up Supabase for the Ragdoll Breeder Tools application with data persistence for genetic records, breeding plans, and litter management.

## Prerequisites

- A [Supabase account](https://supabase.com) (free tier available)
- Node.js and npm installed
- This repository cloned and dependencies installed

## Step 1: Create a Supabase Project

1. Go to [supabase.com](https://supabase.com) and sign up or log in
2. Click "New Project"
3. Enter project details:
   - **Name**: "ragdoll-breeder-tools" (or your preference)
   - **Password**: Choose a secure password
   - **Region**: Choose closest to your location
   - **Pricing Plan**: Free tier is fine for development

4. Wait for project to initialize (5-10 minutes)

## Step 2: Get Your Credentials

1. In the Supabase dashboard, go to **Project Settings** (gear icon)
2. Click **API** in the left sidebar
3. Copy the following values:
   - **Project URL** → `NEXT_PUBLIC_SUPABASE_URL`
   - **Anon Key** → `NEXT_PUBLIC_SUPABASE_ANON_KEY`
   - **Service Role Secret** → `SUPABASE_SERVICE_ROLE_KEY`

4. Go to **Database** → **Connection Pooling** to get:
   - **Connection String** → `DATABASE_URL`

## Step 3: Configure Environment Variables

1. Copy `.env.example` to `.env.local`:
   ```bash
   cp .env.example .env.local
   ```

2. Fill in the values you copied:
   ```env
   NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
   NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGc...
   SUPABASE_SERVICE_ROLE_KEY=eyJhbGc...
   DATABASE_URL=postgresql://postgres:password@db.your-project.supabase.co:5432/postgres
   ```

## Step 4: Generate Migrations

The database schema is defined in `lib/db/schema.ts` using Drizzle ORM.

```bash
npm run db:generate
```

This creates migration files in the `migrations/` directory.

## Step 5: Apply Migrations

Apply the migrations to your Supabase database:

```bash
npm run db:migrate
```

## Step 6: Create Tables in Supabase

If the automated migration doesn't work, you can manually run the SQL in the Supabase dashboard:

1. In Supabase, go to **SQL Editor**
2. Click **New Query**
3. Copy and paste the SQL from the migration files in `migrations/`
4. Click **Run**

Alternatively, use Drizzle Studio to manage your database:

```bash
npm run db:studio
```

## Step 7: Test the Connection

Start the development server:

```bash
npm run dev
```

Open `http://localhost:3000` and verify the app loads without errors.

## Database Schema

The application uses the following tables:

- **users**: Breeder/user accounts
- **cats**: Registered cats with genotype information
- **crosses**: Planned breeding crosses
- **litters**: Actual litter results
- **calculations**: Cached genetic calculation results
- **breeding_records**: Individual kitten records from litters

## API Authentication with @supabase/server

The app uses `@supabase/server` for seamless auth verification in API routes:

```typescript
import { createServerClient } from "@supabase/ssr";

// In API routes, you get full auth context automatically
const supabase = await createServerSideClient();
const user = await getCurrentUser();
```

Benefits:
- ✅ Automatic JWT verification
- ✅ User-scoped and admin clients
- ✅ Built-in CORS handling
- ✅ Request context management
- ✅ No boilerplate code

## Row-Level Security (RLS)

To add security, you can enable Row-Level Security (RLS) on tables:

1. In Supabase, go to **Authentication** → **Policies**
2. Enable RLS on the `cats`, `crosses`, and `litters` tables
3. Add policies like:
   ```sql
   -- Users can only see their own cats
   CREATE POLICY "Users can view own cats"
   ON cats FOR SELECT TO authenticated
   USING (auth.uid() = user_id);
   ```

## Production Deployment

When deploying to production:

1. Store environment variables in your hosting platform's secrets management
2. Enable RLS on all tables for security
3. Set up automated backups in Supabase
4. Consider upgrading from Free tier to Pro for better performance and SLA

## Troubleshooting

### Connection errors
- Verify `DATABASE_URL` is correct with proper password and special characters URL-encoded
- Check firewall rules allow your IP address

### Authentication errors
- Verify `NEXT_PUBLIC_SUPABASE_URL` and `NEXT_PUBLIC_SUPABASE_ANON_KEY` are correct
- Clear browser cookies and try again

### Migration failures
- Check Supabase SQL Editor for any existing tables with conflicting names
- Drop old tables if necessary: `DROP TABLE IF EXISTS table_name;`

## Next Steps

1. **Add User Authentication**: Create sign-up/login UI with Supabase Auth
2. **Enable RLS**: Add security policies to tables
3. **Build API Endpoints**: Create endpoints to save/retrieve genetic records
4. **Add Features**:
   - Save favorite crosses
   - Track litter outcomes
   - Compare historical breeding data
   - Export reports

## Resources

- [Supabase Documentation](https://supabase.com/docs)
- [Drizzle ORM Documentation](https://orm.drizzle.team)
- [Next.js + Supabase Tutorial](https://supabase.com/docs/guides/getting-started/quickstarts/nextjs)
