# The Gathering - Scripture of the Day Website Setup Guide

## Overview
This is a Next.js application that displays a different encouraging NLT scripture each day with a unique AI-generated background image and a community comments section.

## Prerequisites
- Node.js 18+ installed
- npm or yarn package manager
- A Supabase account (free tier available)
- A Replicate account for AI image generation
- Your domain: www.thegathering.today

## Local Setup

### 1. Install Dependencies
```bash
npm install
```

### 2. Set Up Environment Variables
Copy `.env.example` to `.env.local` and fill in your values:

```bash
cp .env.example .env.local
```

Edit `.env.local` with:
- Supabase URL and Keys (from Supabase dashboard)
- Replicate API token (from Replicate dashboard)
- NextAuth secret (generate with: `openssl rand -hex 32`)
- Admin secret (generate with: `openssl rand -hex 32`)

### 3. Set Up Supabase Database

1. Create a new Supabase project at https://supabase.com
2. Go to SQL Editor and run these migrations:

#### Create Scriptures Table
```sql
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

CREATE INDEX idx_scriptures_display_order ON scriptures(display_order);
```

#### Create Comments Table
```sql
CREATE TABLE comments (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  scripture_id UUID NOT NULL REFERENCES scriptures(id) ON DELETE CASCADE,
  author_name TEXT NOT NULL,
  author_email TEXT NOT NULL,
  text TEXT NOT NULL,
  is_approved BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_comments_scripture_id ON comments(scripture_id);
CREATE INDEX idx_comments_is_approved ON comments(is_approved);
```

### 4. Seed Initial Scriptures
```bash
npm run db:seed
```

This will populate your database with 30 encouraging NLT scriptures.

### 5. Run Development Server
```bash
npm run dev
```

Visit http://localhost:3000 to see your site.

## Admin Panel

Access the admin panel at `/admin` with your `ADMIN_SECRET_KEY`.

Features:
- View pending comments
- Approve or delete comments
- Manage scriptures (more features coming)

## Deployment

### Deploy to Vercel (Recommended)

1. Push your code to GitHub
2. Go to https://vercel.com/import
3. Select your repository
4. Add environment variables in Project Settings
5. Deploy!

```bash
git push origin main
```

### Custom Domain Setup

1. In Vercel, go to Settings > Domains
2. Add your domain: www.thegathering.today
3. Update your domain registrar's DNS records to point to Vercel

Vercel will provide you with the DNS records to add.

### Environment Variables for Production

Make sure to set these in your hosting platform:
- `NEXT_PUBLIC_SUPABASE_URL`
- `NEXT_PUBLIC_SUPABASE_ANON_KEY`
- `SUPABASE_SERVICE_KEY`
- `NEXTAUTH_SECRET`
- `NEXTAUTH_URL` (set to https://www.thegathering.today)
- `NEXT_PUBLIC_SITE_URL` (set to https://www.thegathering.today)
- `ADMIN_SECRET_KEY` (strong random value)
- `REPLICATE_API_TOKEN`

## AI Background Image Generation

The site uses Replicate + Stable Diffusion to generate unique, inspiring backgrounds for each scripture.

### Setting Up Scheduled Image Generation

To automatically generate AI backgrounds for scriptures, you can use:

**Option 1: Vercel Cron (Recommended)**
Create a file `app/api/cron/generate-backgrounds/route.ts`:

```typescript
export const dynamic = 'force-dynamic';

export async function GET(request: Request) {
  // Verify cron secret
  if (request.headers.get('authorization') !== `Bearer ${process.env.CRON_SECRET}`) {
    return Response.json({ success: false }, { status: 401 });
  }

  // Your image generation logic here
  
  return Response.json({ success: true });
}
```

Add to `vercel.json`:
```json
{
  "crons": [{
    "path": "/api/cron/generate-backgrounds",
    "schedule": "0 0 * * *"
  }]
}
```

**Option 2: External Cron Service**
Use services like EasyCron or IFTTT to call your API endpoint daily.

## Features Implemented

✅ Daily scripture rotation (one per day)
✅ NLT translation scripture database
✅ Beautiful responsive UI
✅ AI-generated background images
✅ Community comments system
✅ Comment moderation by admin
✅ Admin dashboard
✅ SEO optimized
✅ Mobile responsive

## Features Coming Soon

🔄 User authentication for enhanced personalization
🔄 Save favorite scriptures
🔄 Scripture search and archive
🔄 Email notifications for daily scripture
🔄 Social sharing features
🔄 Multiple language support

## Troubleshooting

### Images not generating?
- Check your Replicate API token is valid
- Ensure you have credits in your Replicate account
- Check server logs for errors

### Comments not appearing?
- Comments require admin approval (check /admin)
- Verify database connection in Supabase
- Check browser console for errors

### Scripture not showing?
- Verify database has data (run seed script)
- Check Supabase connection strings
- Clear browser cache

## Support

For issues or questions, check:
1. Supabase documentation: https://supabase.com/docs
2. Next.js documentation: https://nextjs.org/docs
3. Replicate documentation: https://replicate.com/docs

## License

This project is private and belongs to The Gathering.

## Attribution

Scripture quotations are taken from the Holy Bible, New Living Translation (NLT), copyright © 1996, 2004, 2015 by Tyndale House Foundation. All rights reserved.
