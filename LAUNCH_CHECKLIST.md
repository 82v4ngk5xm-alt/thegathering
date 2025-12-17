# 🚀 The Gathering - Launch Checklist

Follow these steps to get your scripture site live!

## Phase 1: Local Development (30 minutes)

- [ ] Clone/navigate to project directory
- [ ] Run `npm install`
- [ ] Copy `.env.example` to `.env.local`
- [ ] Create Supabase account at https://supabase.com
- [ ] Create Supabase project
- [ ] Copy Supabase URL and keys to `.env.local`
- [ ] Run SQL migrations in Supabase (see SETUP.md)
- [ ] Run `npm run db:seed` to populate scriptures
- [ ] Run `npm run dev`
- [ ] Visit http://localhost:3000 and verify homepage works

## Phase 2: AI Image Generation Setup (15 minutes)

- [ ] Create Replicate account at https://replicate.com
- [ ] Generate API token in Replicate
- [ ] Add `REPLICATE_API_TOKEN` to `.env.local`
- [ ] Manually test image generation or wait for cron job
- [ ] Verify background images appear on homepage

## Phase 3: Admin Setup (10 minutes)

- [ ] Generate `ADMIN_SECRET_KEY`: `openssl rand -hex 32`
- [ ] Add to `.env.local`
- [ ] Generate `NEXTAUTH_SECRET`: `openssl rand -hex 32`
- [ ] Add to `.env.local`
- [ ] Test admin panel at http://localhost:3000/admin
- [ ] Test comment submission and approval flow

## Phase 4: Production Deployment (30 minutes)

- [ ] Create GitHub account (if not already)
- [ ] Initialize git repository: `git init`
- [ ] Add all files: `git add .`
- [ ] Initial commit: `git commit -m "Initial commit"`
- [ ] Push to GitHub: `git push origin main`
- [ ] Sign up for Vercel at https://vercel.com
- [ ] Import GitHub repository
- [ ] Add environment variables:
  - `NEXT_PUBLIC_SUPABASE_URL`
  - `NEXT_PUBLIC_SUPABASE_ANON_KEY`
  - `SUPABASE_SERVICE_KEY`
  - `NEXTAUTH_SECRET`
  - `REPLICATE_API_TOKEN`
  - `ADMIN_SECRET_KEY`
  - `CRON_SECRET` (generate new: `openssl rand -hex 32`)
  - `NEXTAUTH_URL` = `https://www.thegathering.today`
  - `NEXT_PUBLIC_SITE_URL` = `https://www.thegathering.today`
- [ ] Deploy!
- [ ] Test that app works: https://your-vercel-domain.vercel.app

## Phase 5: Custom Domain Configuration (15 minutes)

- [ ] In Vercel project settings → Domains
- [ ] Add your domain: `www.thegathering.today`
- [ ] Copy DNS records provided by Vercel
- [ ] Go to your domain registrar
- [ ] Add/update DNS records to point to Vercel
- [ ] Wait for SSL certificate (5-20 minutes)
- [ ] Test domain: https://www.thegathering.today

## Phase 6: Final Testing (15 minutes)

- [ ] Visit homepage and verify:
  - [ ] Scripture displays correctly
  - [ ] Background image loads
  - [ ] Text is readable over image
  - [ ] Mobile view looks good
- [ ] Test comment submission:
  - [ ] Click "Share Your Reflection"
  - [ ] Fill form and submit
  - [ ] Verify "submitted for moderation" message
- [ ] Check admin panel:
  - [ ] Go to /admin
  - [ ] Verify pending comment appears
  - [ ] Approve comment
  - [ ] Go back to homepage
  - [ ] Verify approved comment appears
- [ ] Test different pages:
  - [ ] Desktop browser
  - [ ] Mobile browser
  - [ ] Tablet

## Phase 7: Scheduled Background Generation (10 minutes)

- [ ] Add `CRON_SECRET` to Vercel environment
- [ ] Verify `vercel.json` has cron config
- [ ] Test cron endpoint (optional):
  ```bash
  curl -H "Authorization: Bearer YOUR_CRON_SECRET" \
    https://www.thegathering.today/api/cron/generate-backgrounds
  ```
- [ ] Monitor first scheduled run (2 AM UTC)

## Phase 8: Optimization & Analytics (Optional)

- [ ] Set up Google Analytics (recommended for tracking usage)
- [ ] Set up email notifications for admin (incoming comments)
- [ ] Configure Supabase backups
- [ ] Set up error tracking (Sentry, etc.)

## Phase 9: Ongoing Maintenance

- [ ] Daily: Check admin panel for comments
- [ ] Weekly: Monitor site performance
- [ ] Monthly: Review Replicate usage/costs
- [ ] Quarterly: Add new scriptures as desired
- [ ] Update dependencies: `npm update`

## Troubleshooting Quick Links

| Issue | Solution |
|-------|----------|
| "Scripture not showing" | Check SETUP.md database section, run seed script |
| "Images not generating" | Verify Replicate token, check API credits |
| "Admin not working" | Verify ADMIN_SECRET_KEY env var, refresh page |
| "Comments not appearing" | Check admin panel, comments need approval |
| "Domain not working" | Wait 20 mins, check DNS propagation |
| "Vercel deployment failed" | Check build logs, verify all env vars set |

## Support Resources

- **Next.js Docs**: https://nextjs.org/docs
- **Supabase Docs**: https://supabase.com/docs
- **Vercel Docs**: https://vercel.com/docs
- **Replicate Docs**: https://replicate.com/docs
- **Tailwind CSS**: https://tailwindcss.com/docs

## Success! 🎉

Your Scripture of the Day website is now live and accessible to everyone at www.thegathering.today!

Next steps:
1. Share your site with friends and family
2. Monitor comments and engage with your community
3. Add more scriptures over time
4. Consider adding features like email notifications or social sharing

Enjoy! 📖✨
