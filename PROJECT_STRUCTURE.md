# Project Structure

```
thegathering/
├── app/                              # Next.js app directory
│   ├── api/                          # API routes
│   │   ├── comments/
│   │   │   ├── [scriptureId]/
│   │   │   │   └── route.ts         # GET comments for scripture
│   │   │   └── create/
│   │   │       └── route.ts         # POST new comment
│   │   ├── scripture/
│   │   │   └── today/
│   │   │       └── route.ts         # GET today's scripture
│   │   ├── admin/
│   │   │   └── comments/
│   │   │       └── route.ts         # Admin comment moderation
│   │   └── cron/
│   │       └── generate-backgrounds/
│   │           └── route.ts         # Scheduled image generation
│   ├── admin/
│   │   └── page.tsx                 # Admin dashboard page
│   ├── g/                           # Group routes (placeholder)
│   │   └── [groupId]/
│   │       └── admin/
│   │           ├── actions.ts
│   │           └── page.tsx
│   ├── layout.tsx                   # Root layout
│   └── page.tsx                     # Homepage
│
├── components/                       # React components
│   ├── ScriptureDisplay.tsx         # Scripture UI component
│   ├── CommentsDisplay.tsx          # Comments section component
│   └── AdminPanel.tsx               # Admin dashboard component
│
├── lib/                             # Utility functions
│   ├── supabase.ts                  # Supabase client setup
│   ├── scripture.ts                 # Scripture data operations
│   └── image-generation.ts          # AI image generation
│
├── types/                           # TypeScript types
│   └── index.ts                     # All type definitions
│
├── styles/                          # CSS styles
│   └── globals.css                  # Global Tailwind styles
│
├── scripts/                         # Node scripts
│   └── seed-scriptures.ts           # Database seeding script
│
├── public/                          # Static assets
│   └── (images, fonts, etc.)
│
├── .env.example                     # Environment variables template
├── .gitignore                       # Git ignore rules
├── SETUP.md                         # Detailed setup guide
├── README.md                        # Project overview
├── LAUNCH_CHECKLIST.md              # Deployment checklist
├── package.json                     # Dependencies and scripts
├── tsconfig.json                    # TypeScript config
├── tailwind.config.js               # Tailwind CSS config
├── postcss.config.js                # PostCSS config
├── next.config.js                   # Next.js config
└── vercel.json                      # Vercel deployment config
```

## File Descriptions

### Core Application Files

| File | Purpose |
|------|---------|
| `app/layout.tsx` | Root layout wrapping all pages |
| `app/page.tsx` | Main homepage with scripture display |
| `app/admin/page.tsx` | Admin dashboard page |

### Components

| Component | Purpose |
|-----------|---------|
| `ScriptureDisplay.tsx` | Renders scripture with background |
| `CommentsDisplay.tsx` | Displays comments and comment form |
| `AdminPanel.tsx` | Admin moderation interface |

### API Routes

| Endpoint | Method | Purpose |
|----------|--------|---------|
| `/api/scripture/today` | GET | Fetch today's scripture |
| `/api/comments/[scriptureId]` | GET | Fetch approved comments |
| `/api/comments/create` | POST | Submit new comment |
| `/api/admin/comments` | GET/PATCH | Admin comment management |
| `/api/cron/generate-backgrounds` | GET | Scheduled image generation |

### Utilities

| Module | Functions |
|--------|-----------|
| `lib/scripture.ts` | getTodayScripture, getCommentsForScripture, addComment, etc. |
| `lib/supabase.ts` | Supabase client instances |
| `lib/image-generation.ts` | generateScriptureBackground, getUnsplashBackground |

### Configuration

| File | Purpose |
|------|---------|
| `package.json` | Dependencies, scripts |
| `tsconfig.json` | TypeScript compiler options |
| `tailwind.config.js` | Tailwind styling system |
| `next.config.js` | Next.js configuration |
| `vercel.json` | Vercel deployment settings |

## Data Flow

```
Homepage Request
    ↓
app/page.tsx (Server Component)
    ↓
getTodayScripture() from lib/scripture.ts
    ↓
Query Supabase: SELECT * FROM scriptures WHERE display_order = TODAY_INDEX
    ↓
Return Scripture object with:
    - book, chapter, verses, text
    - background_image_url
    ↓
Render ScriptureDisplay component
    ↓
Show scripture with AI-generated background image
    ↓
Fetch and render approved comments
```

## Adding New Features

### To Add a New Scripture Field:
1. Alter Supabase `scriptures` table schema
2. Update TypeScript `Scripture` interface in `types/index.ts`
3. Update seed script in `scripts/seed-scriptures.ts`
4. Update display in `components/ScriptureDisplay.tsx`

### To Add a New API Endpoint:
1. Create new file in `app/api/[route]/route.ts`
2. Export GET, POST, PATCH, or DELETE functions
3. Add types to `types/index.ts` if needed

### To Add a New Admin Feature:
1. Add UI to `components/AdminPanel.tsx`
2. Create API endpoint in `app/api/admin/[feature]/route.ts`
3. Implement authorization check with `ADMIN_SECRET_KEY`

## Environment Variables

See `.env.example` for all required variables and their purposes.
