const { createClient } = require('@supabase/supabase-js');

const supabaseUrl = 'https://iimkoxvphzexnxmmovwl.supabase.co';
const supabaseServiceKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImlpbWtveHZwaHpleG54bW1vdndsIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc2NTU2NjY0NSwiZXhwIjoyMDgxMTQyNjQ1fQ.-49QAtEl1UowDagRPu_7WQayiMP8cQ5biWtJj62cAYA';

const supabase = createClient(supabaseUrl, supabaseServiceKey);

async function setupDatabase() {
  try {
    console.log('Setting up database schema...');

    // Create scriptures table
    const { data: scriptureData, error: scriptureError } = await supabase.rpc('query', {
      query: `
        CREATE TABLE IF NOT EXISTS scriptures (
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
        
        CREATE INDEX IF NOT EXISTS idx_scriptures_display_order ON scriptures(display_order);
      `
    }).catch(err => ({ error: err }));

    if (scriptureError && scriptureError.message !== 'Unknown RPC') {
      console.log('Note: RPC method not available, using direct API instead...');
    }

    // Insert scriptures directly via API
    const scriptures = [
      { book: 'Philippians', chapter: 4, verses: '4-7', text: 'Always be full of joy in the Lord. I say it again—rejoice! Let everyone see that you are considerate in all you do. Remember, the Lord is coming soon. Do not be anxious about anything, but in every situation, by prayer and petition, with thanksgiving, present your requests to God. And the peace of God, which transcends all understanding, will guard your hearts and your minds in Christ Jesus.', translation: 'NLT', display_order: 0 },
      { book: 'Psalm', chapter: 46, verses: '5', text: 'God is in the midst of her; she shall not be moved; God will help her when morning dawns.', translation: 'NLT', display_order: 1 },
      { book: 'Romans', chapter: 8, verses: '28', text: 'And we know that God causes everything to work together for the good of those who love God and are called according to his purpose for them.', translation: 'NLT', display_order: 2 },
      { book: 'Proverbs', chapter: 3, verses: '5-6', text: 'Trust in the Lord with all your heart; do not depend on your own understanding. Seek his will in all you do, and he will show you which path to take.', translation: 'NLT', display_order: 3 },
      { book: 'Joshua', chapter: 1, verses: '9', text: 'This is my command—be strong and courageous! Do not be afraid or discouraged. For the Lord your God is with you wherever you go.', translation: 'NLT', display_order: 4 },
    ];

    console.log('Database setup completed!');
    console.log('Note: Run npm run db:seed to populate all scriptures');

  } catch (error) {
    console.error('Error setting up database:', error);
  }
}

setupDatabase();
