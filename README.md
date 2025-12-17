# The Gathering - Scripture of the Day

A beautiful, modern website that displays a different encouraging scripture from the NLT translation every single day, complete with AI-generated background images and a community comments section.

## 🌟 Features

- **Daily Scripture**: A new encouraging scripture automatically rotates each day
- **NLT Translation**: All scriptures use the New Living Translation for clarity and encouragement
- **AI-Generated Backgrounds**: Each scripture gets a unique, inspiring background image powered by Stable Diffusion
- **Community Comments**: Users can share their reflections and thoughts on each day's scripture
- **Comment Moderation**: Admin dashboard to review and approve comments
- **Mobile Responsive**: Beautiful design that works perfectly on all devices
- **SEO Optimized**: Built with Next.js for excellent search engine visibility
- **Performance**: Lightning-fast page loads with ISR (Incremental Static Regeneration)

## 🚀 Quick Start

### Prerequisites
- Node.js 18+
- npm or yarn
- Supabase account (free)
- Replicate account (free)

### Installation

1. **Install dependencies**
   ```bash
   npm install
   ```

2. **Configure environment variables**
   ```bash
   cp .env.example .env.local
   # Edit .env.local with your credentials
   ```

3. **Set up Supabase**
   - Create project at https://supabase.com
   - Run SQL migrations (see SETUP.md)

4. **Seed scriptures**
   ```bash
   npm run db:seed
   ```

5. **Run development server**
   ```bash
   npm run dev
   ```

   Visit http://localhost:3000

## 📚 Documentation

- [Full Setup Guide](SETUP.md) - Complete installation and deployment instructions
- [Database Schema](#database-schema) - Information about database structure
- [Admin Dashboard](#admin-dashboard) - How to manage content

## 🏗️ Tech Stack

- **Framework**: Next.js 14 with TypeScript
- **Styling**: Tailwind CSS
- **Database**: Supabase (PostgreSQL)
- **Authentication**: NextAuth.js
- **AI Images**: Replicate + Stable Diffusion
- **Hosting**: Vercel

## 📖 Database Schema

### Scriptures Table
```sql
- id (UUID, Primary Key)
- book (TEXT) - e.g., "Psalm", "John"
- chapter (INTEGER) - Chapter number
- verses (TEXT) - Verse range e.g., "23:1-4"
- text (TEXT) - Full scripture text
- translation (TEXT) - "NLT"
- display_order (INTEGER) - Order in rotation
- background_image_url (TEXT) - AI-generated image URL
- created_at (TIMESTAMP)
- updated_at (TIMESTAMP)
```

### Comments Table
```sql
- id (UUID, Primary Key)
- scripture_id (UUID, Foreign Key)
- author_name (TEXT)
- author_email (TEXT)
- text (TEXT) - Comment content
- is_approved (BOOLEAN) - Moderation status
- created_at (TIMESTAMP)
```

## 👨‍💼 Admin Dashboard

Access at `/admin` with your `ADMIN_SECRET_KEY`:

- **Pending Comments**: Review and approve/delete user comments
- **Scriptures**: View and manage scripture database
- **Moderation**: Keep your community safe and respectful

## 🎨 Customization

### Change Colors
Edit `tailwind.config.js`:
```js
colors: {
  'brand-blue': '#your-color',
  'brand-gold': '#your-color',
}
```

### Add More Scriptures
Edit `scripts/seed-scriptures.ts` and run:
```bash
npm run db:seed
```

### Modify Scripture Rotation
Edit `lib/scripture.ts` `getTodayScripture()` function

## 🚢 Deployment

### Deploy to Vercel
```bash
npm run build
git push
```

Vercel auto-deploys from Git. Set environment variables in Vercel dashboard.

### Configure Custom Domain
1. Add domain in Vercel project settings
2. Update DNS records with provided values
3. Wait for SSL certificate (usually 10 minutes)

## 📧 Support

For setup help, see [SETUP.md](SETUP.md)

## 📄 License

Private project for The Gathering

## 🙏 Scripture Attribution

All scripture quotations are from the Holy Bible, New Living Translation (NLT), copyright © 1996, 2004, 2015 by Tyndale House Foundation.
