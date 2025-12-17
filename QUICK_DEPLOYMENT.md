# 🚀 Production Deployment - Quick Guide

## Step 1: Prepare Your Code for Deployment

```bash
# Make sure everything is committed
cd /Users/davidgorham/thegathering
git init
git add .
git commit -m "Scripture of the Day - Ready for production"
```

## Step 2: Push to GitHub

1. Go to https://github.com/new
2. Create a new repository named `thegathering`
3. Don't initialize with README
4. Follow the commands to push your code:

```bash
git remote add origin https://github.com/YOUR_USERNAME/thegathering.git
git branch -M main
git push -u origin main
```

## Step 3: Deploy to Vercel

1. Go to https://vercel.com/signup
2. Sign up with GitHub (click "Continue with GitHub")
3. Authorize Vercel to access your GitHub account
4. Go to https://vercel.com/new
5. Select your `thegathering` repository
6. Click "Import"

## Step 4: Add Environment Variables in Vercel

In the Vercel import screen, click "Environment Variables" and add:

```
NEXT_PUBLIC_SUPABASE_URL=https://iimkoxvphzexnxmmovwl.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImlpbWtveHZwaHpleG54bW1vdndsIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjU1NjY2NDUsImV4cCI6MjA4MTE0MjY0NX0.qug8PH4mDzuDSH069BqNGZrhPRuFbFK7wpGoAWiZ6h4
SUPABASE_SERVICE_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImlpbWtveHZwaHpleG54bW1vdndsIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc2NTU2NjY0NSwiZXhwIjoyMDgxMTQyNjQ1fQ.-49QAtEl1UowDagRPu_7WQayiMP8cQ5biWtJj62cAYA
ADMIN_SECRET_KEY=admin_secret_thegathering_2025
NEXTAUTH_SECRET=thegathering_2025_supersecret_key_change_me
NEXTAUTH_URL=https://www.thegathering.today
NEXT_PUBLIC_SITE_URL=https://www.thegathering.today
REPLICATE_API_TOKEN=your_replicate_token_here
CRON_SECRET=your_cron_secret_here
```

Then click "Deploy"

## Step 5: Wait for Deployment

- Vercel will build and deploy your app
- Takes 2-3 minutes
- You'll get a temporary URL like `https://thegathering-xyz.vercel.app`

## Step 6: Connect Your Custom Domain

Once deployment is done:

1. In Vercel, go to "Domains"
2. Click "Add"
3. Enter `www.thegathering.today`
4. Follow the DNS setup instructions
5. Update your domain registrar's DNS records to point to Vercel

## Step 7: Verify Everything Works

✅ Visit your domain
✅ Scripture displays
✅ Test comment submission
✅ Test admin panel at `/admin`

## Important Notes

⚠️ **Change these in production:**
- `ADMIN_SECRET_KEY` - Set a strong, unique password
- `NEXTAUTH_SECRET` - Generate a random secret

You can generate secrets with:
```bash
openssl rand -hex 32
```

## Troubleshooting

**Scripture not displaying?**
- Check environment variables in Vercel are correct
- Verify Supabase URL and keys match

**Comments not working?**
- Ensure `SUPABASE_SERVICE_KEY` is set
- Check admin secret key is correct

**Admin panel not accessible?**
- Make sure `ADMIN_SECRET_KEY` environment variable exists in Vercel

## Next Steps

After deployment:
1. Add more scriptures via the admin panel
2. Set up scheduled image generation (Replicate)
3. Monitor analytics and user engagement
