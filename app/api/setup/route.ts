import { createClient } from '@supabase/supabase-js'
import { NextResponse } from 'next/server'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const supabaseServiceKey = process.env.SUPABASE_SERVICE_KEY

export async function GET() {
  try {
    if (!supabaseUrl || !supabaseServiceKey) {
      return NextResponse.json({ error: 'Missing Supabase credentials' }, { status: 500 })
    }

    const supabase = createClient(supabaseUrl, supabaseServiceKey)

    // Create scriptures table
    let scripturesError = null
    try {
      const result = await supabase.rpc('exec', {
        sql: `
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
        `,
      })
      scripturesError = result.error
    } catch (err) {
      scripturesError = 'RPC not available'
    }

    console.log('Setup attempt:', { scripturesError })

    return NextResponse.json({
      message: 'Setup page - Manual table creation needed via Supabase console',
      instructions: 'Please copy and paste the SQL from /setup.sql into Supabase SQL Editor',
    })
  } catch (error) {
    console.error('Setup error:', error)
    return NextResponse.json({ error: String(error) }, { status: 500 })
  }
}
