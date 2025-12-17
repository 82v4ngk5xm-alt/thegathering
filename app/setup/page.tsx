'use client'

import { useState } from 'react'

export default function SetupPage() {
  const [copied, setCopied] = useState(false)

  const sqlScript = `-- Create Scriptures Table
CREATE TABLE IF NOT EXISTS public.scriptures (
  id uuid NOT NULL DEFAULT gen_random_uuid(),
  book text NOT NULL,
  chapter integer NOT NULL,
  verses text NOT NULL,
  text text NOT NULL,
  translation text NOT NULL DEFAULT 'NLT'::text,
  display_order integer NOT NULL UNIQUE,
  background_image_url text,
  created_at timestamp DEFAULT CURRENT_TIMESTAMP,
  updated_at timestamp DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (id)
);

-- Create Index
CREATE INDEX IF NOT EXISTS idx_scriptures_display_order ON public.scriptures (display_order);

-- Create Comments Table
CREATE TABLE IF NOT EXISTS public.comments (
  id uuid NOT NULL DEFAULT gen_random_uuid(),
  scripture_id uuid NOT NULL,
  author_name text NOT NULL,
  author_email text NOT NULL,
  text text NOT NULL,
  is_approved boolean DEFAULT false,
  created_at timestamp DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (id),
  CONSTRAINT comments_scripture_id_fkey FOREIGN KEY (scripture_id) REFERENCES public.scriptures (id) ON DELETE CASCADE
);

-- Create Indexes for Comments
CREATE INDEX IF NOT EXISTS idx_comments_scripture_id ON public.comments (scripture_id);
CREATE INDEX IF NOT EXISTS idx_comments_is_approved ON public.comments (is_approved);

-- Enable Row Level Security
ALTER TABLE public.scriptures ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.comments ENABLE ROW LEVEL SECURITY;

-- Create RLS Policies
DROP POLICY IF EXISTS "Public can read scriptures" ON public.scriptures;
CREATE POLICY "Public can read scriptures" ON public.scriptures FOR SELECT USING (true);

DROP POLICY IF EXISTS "Public can read approved comments" ON public.comments;
CREATE POLICY "Public can read approved comments" ON public.comments FOR SELECT USING (is_approved = true);

DROP POLICY IF EXISTS "Anyone can insert comments" ON public.comments;
CREATE POLICY "Anyone can insert comments" ON public.comments FOR INSERT WITH CHECK (true);`

  const handleCopy = async () => {
    await navigator.clipboard.writeText(sqlScript)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-8">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-gray-800 mb-2">🎉 Setup - The Gathering</h1>
          <p className="text-lg text-gray-600">Create your database tables</p>
        </div>

        {/* Instructions */}
        <div className="bg-white rounded-lg shadow-lg p-8 mb-8">
          <h2 className="text-2xl font-bold text-gray-800 mb-4">Step 1: Create Database Tables</h2>

          <div className="bg-blue-50 border-l-4 border-blue-500 p-4 mb-6">
            <p className="text-blue-800 font-semibold">ℹ️ Important</p>
            <p className="text-blue-700 mt-2">
              Copy the SQL script below and run it in your Supabase SQL Editor. This will create the necessary tables for your scripture website.
            </p>
          </div>

          <div className="mb-6">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-semibold text-gray-800">SQL Script</h3>
              <button
                onClick={handleCopy}
                className={`px-4 py-2 rounded font-semibold transition ${
                  copied
                    ? 'bg-green-500 text-white'
                    : 'bg-blue-500 hover:bg-blue-600 text-white'
                }`}
              >
                {copied ? '✓ Copied' : 'Copy'}
              </button>
            </div>

            <textarea
              value={sqlScript}
              readOnly
              className="w-full h-96 p-4 bg-gray-100 border border-gray-300 rounded font-mono text-sm text-gray-800"
            />
          </div>

          {/* Instructions */}
          <div className="bg-gray-50 border border-gray-200 rounded-lg p-6 mb-6">
            <h3 className="text-lg font-semibold text-gray-800 mb-4">📋 How to Run the Script</h3>
            <ol className="space-y-3 text-gray-700">
              <li className="flex gap-3">
                <span className="font-bold text-blue-600 min-w-fit">1.</span>
                <span>Go to <a href="https://app.supabase.com" target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">Supabase Dashboard</a></span>
              </li>
              <li className="flex gap-3">
                <span className="font-bold text-blue-600 min-w-fit">2.</span>
                <span>Select your project (iimkoxvphzexnxmmovwl)</span>
              </li>
              <li className="flex gap-3">
                <span className="font-bold text-blue-600 min-w-fit">3.</span>
                <span>Go to <strong>SQL Editor</strong> in the left sidebar</span>
              </li>
              <li className="flex gap-3">
                <span className="font-bold text-blue-600 min-w-fit">4.</span>
                <span>Click <strong>"New Query"</strong></span>
              </li>
              <li className="flex gap-3">
                <span className="font-bold text-blue-600 min-w-fit">5.</span>
                <span>Paste the SQL script above</span>
              </li>
              <li className="flex gap-3">
                <span className="font-bold text-blue-600 min-w-fit">6.</span>
                <span>Click <strong>"Run"</strong> button</span>
              </li>
              <li className="flex gap-3">
                <span className="font-bold text-blue-600 min-w-fit">7.</span>
                <span>Wait for the "Success!" message</span>
              </li>
            </ol>
          </div>

          {/* Next Steps */}
          <div className="bg-green-50 border-l-4 border-green-500 p-4">
            <p className="text-green-800 font-semibold">✅ After Running the Script</p>
            <p className="text-green-700 mt-2">
              Refresh this page. The database tables will be created and ready to use!
            </p>
          </div>
        </div>

        {/* Visual Steps */}
        <div className="grid md:grid-cols-3 gap-6">
          <div className="bg-white rounded-lg shadow p-6 text-center">
            <div className="text-3xl font-bold text-blue-600 mb-2">1️⃣</div>
            <h3 className="font-semibold text-gray-800 mb-2">Copy SQL</h3>
            <p className="text-sm text-gray-600">Click the "Copy" button above</p>
          </div>

          <div className="bg-white rounded-lg shadow p-6 text-center">
            <div className="text-3xl font-bold text-blue-600 mb-2">2️⃣</div>
            <h3 className="font-semibold text-gray-800 mb-2">Go to Supabase</h3>
            <p className="text-sm text-gray-600">Open SQL Editor and paste</p>
          </div>

          <div className="bg-white rounded-lg shadow p-6 text-center">
            <div className="text-3xl font-bold text-blue-600 mb-2">3️⃣</div>
            <h3 className="font-semibold text-gray-800 mb-2">Run & Refresh</h3>
            <p className="text-sm text-gray-600">Click Run, then refresh this page</p>
          </div>
        </div>
      </div>
    </div>
  )
}
