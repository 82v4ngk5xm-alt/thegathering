# 🌐 Complete Deployment & Setup Guide

## Table of Contents
1. [Quick Start](#quick-start)
2. [Detailed Setup](#detailed-setup)
3. [Database Configuration](#database-configuration)
4. [Environment Variables](#environment-variables)
5. [Deployment](#deployment)
6. [Post-Deployment](#post-deployment)
7. [Troubleshooting](#troubleshooting)

---

## Quick Start

**Time: ~1 hour total**

```bash
# 1. Install dependencies
npm install

# 2. Set up environment
cp .env.example .env.local
# Edit .env.local with your values

# 3. Set up database (see Database Configuration section)

# 4. Seed scriptures
npm run db:seed

# 5. Run locally
npm run dev

# Visit http://localhost:3000
```

---

## Detailed Setup

### Step 1: Create Supabase Project

1. Go to https://supabase.com
2. Sign up or log in
3. Click "New Project"
4. Fill in:
   - Project name: "the-gathering"
   - Database password: Generate strong password (save this!)
   - Region: Choose closest to your users
5. Click "Create new project"
6. Wait for project to initialize (~2 minutes)

### Step 2: Get Supabase Credentials

1. In Supabase dashboard, go to "Settings" → "API"
2. Copy these values:
   - `Project URL` → `NEXT_PUBLIC_SUPABASE_URL`
   - `anon public` key → `NEXT_PUBLIC_SUPABASE_ANON_KEY`
   - `service_role` key → `SUPABASE_SERVICE_KEY`

### Step 3: Set Up Database Tables

1. In Supabase, go to "SQL Editor"
2. Click "New query"
3. Copy and paste this SQL:

```sql
-- Create Scriptures Table
CREATE TABLE scriptures (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  book TEXT NOT NULL,
  chapter INTEGER NOT NULL,
  verses TEXT NOT NULL,
  text TEXT NOT NULL,
  translation TEXT NOT NULL DEFAULT 'NLT',
  display_order INTEGER NOT NULL UNIQUE,
  background_image_url TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Create index for faster queries
CREATE INDEX idx_scriptures_display_order ON scriptures(display_order);

-- Create Comments Table
CREATE TABLE comments (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  scripture_id UUID NOT NULL REFERENCES scriptures(id) ON DELETE CASCADE,
  author_name TEXT NOT NULL,
  author_email TEXT NOT NULL,
  text TEXT NOT NULL,
  is_approved BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Create indexes for comments
CREATE INDEX idx_comments_scripture_id ON comments(scripture_id);
CREATE INDEX idx_comments_is_approved ON comments(is_approved);

-- Enable RLS (Row Level Security)
ALTER TABLE scriptures ENABLE ROW LEVEL SECURITY;
ALTER TABLE comments ENABLE ROW LEVEL SECURITY;

-- Create RLS policies for public reading
CREATE POLICY "Public can read scriptures" ON scriptures
  FOR SELECT USING (true);

CREATE POLICY "Public can read approved comments" ON comments
  FOR SELECT USING (is_approved = true);

-- Allow anyone to insert comments
CREATE POLICY "Anyone can insert comments" ON comments
  FOR INSERT WITH CHECK (true);
```

4. Click "Run"
5. You should see "Success!" message

### Step 4: Create Replicate Account

1. Go to https://replicate.com
2. Sign up with GitHub
3. Click your avatar → "API tokens"
4. Click "Create token"
5. Copy token → save as `REPLICATE_API_TOKEN`
6. Add free credits if prompted

### Step 5: Configure Environment Variables

Create `.env.local`:

```bash
cp .env.example .env.local
```

Edit `.env.local` and fill in:

```env
# From Supabase
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_anon_key
SUPABASE_SERVICE_KEY=your_service_key

# Generate these:
# For NEXTAUTH_SECRET: openssl rand -hex 32
# For ADMIN_SECRET_KEY: openssl rand -hex 32
# For CRON_SECRET: openssl rand -hex 32
NEXTAUTH_SECRET=your_generated_secret
ADMIN_SECRET_KEY=your_admin_secret
CRON_SECRET=your_cron_secret

# From Replicate
REPLICATE_API_TOKEN=your_replicate_token

# Local development
NEXTAUTH_URL=http://localhost:3000

# Production (update after deployment)
NEXT_PUBLIC_SITE_URL=https://www.thegathering.today
```

### Step 6: Generate Secrets

Run these commands to generate secure secrets:

```bash
# Generate three secrets (run each once)
openssl rand -hex 32
openssl rand -hex 32
openssl rand -hex 32
```

Copy these values to your `.env.local` file.

### Step 7: Seed Database

Run this command to populate with 30 encouraging scriptures:

```bash
npm run db:seed
```

You should see output like:
```
Starting to seed scriptures...
Successfully seeded 30 scriptures!
Next steps:
...
```

Verify in Supabase:
- Go to "Table Editor"
- Click "scriptures"
- You should see 30 rows with scripture data

### Step 8: Run Development Server

```bash
npm run dev
```

Visit http://localhost:3000 and you should see:
- A beautiful scripture with background image
- Scripture text centered on the page
- Comments section below
- Share Your Reflection button

### Step 9: Test Everything

**Test Homepage:**
- [ ] Scripture displays
- [ ] Background image appears
- [ ] Text is readable
- [ ] Mobile view works

**Test Comments:**
- [ ] Click "Share Your Reflection"
- [ ] Fill in name, email, comment
- [ ] Click "Submit"
- [ ] See "submitted for moderation" message

**Test Admin Panel:**
- [ ] Visit http://localhost:3000/admin
- [ ] You should see your pending comment
- [ ] Click "Approve"
- [ ] Go back to homepage (refresh)
- [ ] Comment should now be visible

---

## Environment Variables

| Variable | Required | Description | Example |
|----------|----------|-------------|---------|
| `NEXT_PUBLIC_SUPABASE_URL` | ✅ | Supabase project URL | `https://xxx.supabase.co` |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | ✅ | Supabase anon key | `eyJhbGc...` |
| `SUPABASE_SERVICE_KEY` | ✅ | Supabase service role key | `eyJhbGc...` |
| `NEXTAUTH_SECRET` | ✅ | Auth encryption secret | `abc123def456...` |
| `NEXTAUTH_URL` | ✅ (Dev) | App URL for dev | `http://localhost:3000` |
| `ADMIN_SECRET_KEY` | ✅ | Admin dashboard secret | `xyz789...` |
| `REPLICATE_API_TOKEN` | ✅ | API token for image generation | `r8_xxx...` |
| `CRON_SECRET` | ✅ (Prod) | Secret for scheduled jobs | `cron123...` |
| `NEXT_PUBLIC_SITE_URL` | ⚠️ | Production site URL | `https://www.thegathering.today` |

---

## Deployment

### Deploy to Vercel (Recommended)

**Prerequisites:**
- GitHub account
- Vercel account (free)
- Code pushed to GitHub

**Steps:**

1. **Initialize Git** (if not already done)
   ```bash
   git init
   git add .
   git commit -m "Initial commit: Scripture of the Day"
   git remote add origin https://github.com/YOUR_USERNAME/thegathering.git
   git branch -M main
   git push -u origin main
   ```

2. **Sign up for Vercel**
   - Go to https://vercel.com/signup
   - Click "Continue with GitHub"
   - Authorize Vercel to access GitHub

3. **Import Project**
   - Go to https://vercel.com/new
   - Select your GitHub repository
   - Click "Import"

4. **Add Environment Variables**
   - Go to "Project Settings" → "Environment Variables"
   - Add each variable from your `.env.local`:
     - Click "Add Another"
     - Paste key and value
     - Select "Production" (or Development as needed)
   - Important: Add these for production:
     - `NEXTAUTH_URL=https://www.thegathering.today`
     - `NEXT_PUBLIC_SITE_URL=https://www.thegathering.today`
     - `CRON_SECRET` (generate new)

5. **Deploy**
   - Click "Deploy"
   - Wait for deployment (usually 2-3 minutes)
   - You'll get a URL like `https://thegathering-abc123.vercel.app`

6. **Test Deployment**
   - Visit your Vercel URL
   - Verify scripture and comments work
   - Check admin panel: `/admin`

### Connect Custom Domain

1. **Add Domain in Vercel**
   - Go to "Project Settings" → "Domains"
   - Enter: `www.thegathering.today`
   - Click "Add"

2. **Update DNS**
   - Vercel shows DNS records to add
   - Go to your domain registrar (GoDaddy, Namecheap, etc.)
   - Add the DNS records provided by Vercel
   - Wait 10-20 minutes for DNS to propagate

3. **Verify**
   - Visit https://www.thegathering.today
   - Should show your Vercel deployment
   - SSL certificate auto-configured

**DNS Records Typically Look Like:**
```
Name: www
Type: CNAME
Value: cname.vercel-dns.com
```

---

## Post-Deployment

### 1. Update Environment Variables

If you used temporary URLs during setup, update these in Vercel:

**In Vercel Project Settings → Environment Variables:**

```
NEXTAUTH_URL=https://www.thegathering.today
NEXT_PUBLIC_SITE_URL=https://www.thegathering.today
```

### 2. Test All Features

**Homepage:**
- [ ] Visit https://www.thegathering.today
- [ ] Scripture displays with background
- [ ] Mobile responsive
- [ ] No console errors

**Comments:**
- [ ] Submit comment
- [ ] See moderation message
- [ ] Check admin panel

**Admin Panel:**
- [ ] Visit `/admin`
- [ ] Approve/reject comments
- [ ] Verify comments appear on homepage

### 3. Set Up Email Notifications (Optional)

To get notified of new comments:

1. Go to Supabase project
2. Settings → Email Templates
3. Create custom template for comment notifications

Or use a service like:
- SendGrid (free tier)
- AWS SES
- Postmark

### 4. Monitor Performance

**Set up Monitoring:**
- Vercel Analytics: Built-in, no setup needed
- Google Analytics: Add tracking ID
- Error tracking: Sentry, LogRocket, etc.

---

## Troubleshooting

### "Scripture not showing"

**Problem:** Homepage shows "Scripture Loading..."

**Solutions:**
1. Check Supabase connection:
   - Verify `NEXT_PUBLIC_SUPABASE_URL` in `.env.local`
   - Verify `NEXT_PUBLIC_SUPABASE_ANON_KEY` is correct
   - Check Supabase table has data: `SELECT COUNT(*) FROM scriptures;`

2. Run seed script again:
   ```bash
   npm run db:seed
   ```

3. Check browser console for errors (F12 → Console)

### "Images not generating"

**Problem:** Black background instead of background image

**Solutions:**
1. Check Replicate token:
   ```bash
   echo $REPLICATE_API_TOKEN  # Should not be empty
   ```

2. Verify Replicate account has credits:
   - Log into Replicate
   - Check "Account" → Credits

3. Manually trigger generation:
   ```bash
   curl -H "Authorization: Bearer YOUR_CRON_SECRET" \
     https://www.thegathering.today/api/cron/generate-backgrounds
   ```

4. Check fallback images:
   - If Replicate fails, should show Unsplash fallback
   - If not, check browser console

### "Admin panel returns 401"

**Problem:** Admin page shows "Unauthorized"

**Solutions:**
1. Verify `ADMIN_SECRET_KEY` is set
2. Verify env var is available (rebuild if needed):
   ```bash
   npm run build
   npm run start
   ```

3. For Vercel:
   - Check Project Settings → Environment Variables
   - Ensure `ADMIN_SECRET_KEY` is there
   - Redeploy: Push new commit or click "Redeploy"

### "Comments not appearing"

**Problem:** Comments submitted but don't show on site

**Solutions:**
1. Check admin panel `/admin`
   - Are pending comments there?
   - Are they marked as approved?

2. Click "Approve" in admin panel
3. Go back to homepage (refresh)
4. Comments should appear

### "Domain not connecting"

**Problem:** www.thegathering.today shows error or old site

**Solutions:**
1. Wait 20-30 minutes (DNS propagation)
2. Check DNS propagation: https://whatsmydns.net/
3. Verify DNS records in domain registrar match Vercel's values
4. Check Vercel project settings → Domains
   - Domain should show "Verified" with checkmark
   - If not, re-add DNS records

### "Build fails on Vercel"

**Problem:** Deployment fails during build

**Solutions:**
1. Check Vercel build logs (click deployment)
2. Common issues:
   - Missing environment variable: Add to Settings → Environment Variables
   - Node version: Use Node 18+ (Vercel default)
   - Type errors: Run `npm run build` locally first

3. Check local build:
   ```bash
   npm run build
   npm run start
   ```

4. If local works but Vercel fails:
   - Try redeploying
   - Check all env vars are set
   - Check `.gitignore` isn't excluding needed files

### "Cron job not running"

**Problem:** Background images not generating automatically

**Solutions:**
1. Verify `vercel.json` has cron config
2. Check `CRON_SECRET` is set in Vercel
3. Manually test:
   ```bash
   curl -H "Authorization: Bearer YOUR_CRON_SECRET" \
     https://www.thegathering.today/api/cron/generate-backgrounds
   ```

4. Check Vercel Crons tab (Settings → Crons)
   - Should show scheduled job
   - Check last run status

---

## Support & Resources

### Official Documentation
- [Next.js Docs](https://nextjs.org/docs)
- [Supabase Docs](https://supabase.com/docs)
- [Vercel Docs](https://vercel.com/docs)
- [Replicate Docs](https://replicate.com/docs)
- [Tailwind CSS](https://tailwindcss.com/docs)

### Community Help
- Next.js Discord: https://discord.gg/nextjs
- Supabase Discord: https://discord.supabase.com
- Stack Overflow: Tag your questions with relevant frameworks

### Emergency Help
- Check browser console (F12)
- Check server logs:
  - Local: Terminal where you ran `npm run dev`
  - Vercel: Project → Deployments → Logs
- Check Supabase dashboard for database errors

---

**You're all set! 🚀 Your Scripture of the Day website is now live!**
