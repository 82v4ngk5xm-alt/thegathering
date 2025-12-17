import { supabaseAdmin } from '../lib/supabase'

// 30 encouraging NLT scriptures
const encouragingScriptures = [
  {
    book: 'Philippians',
    chapter: 4,
    verses: '4-7',
    text: 'Always be full of joy in the Lord. I say it again—rejoice! Let everyone see that you are considerate in all you do. Remember, the Lord is coming soon. Do not be anxious about anything, but in every situation, by prayer and petition, with thanksgiving, present your requests to God. And the peace of God, which transcends all understanding, will guard your hearts and your minds in Christ Jesus.',
    translation: 'NLT',
  },
  {
    book: 'Psalm',
    chapter: 46,
    verses: '5',
    text: 'God is in the midst of her; she shall not be moved; God will help her when morning dawns.',
    translation: 'NLT',
  },
  {
    book: 'Romans',
    chapter: 8,
    verses: '28',
    text: 'And we know that God causes everything to work together for the good of those who love God and are called according to his purpose for them.',
    translation: 'NLT',
  },
  {
    book: 'Proverbs',
    chapter: 3,
    verses: '5-6',
    text: 'Trust in the Lord with all your heart; do not depend on your own understanding. Seek his will in all you do, and he will show you which path to take.',
    translation: 'NLT',
  },
  {
    book: 'Joshua',
    chapter: 1,
    verses: '9',
    text: 'This is my command—be strong and courageous! Do not be afraid or discouraged. For the Lord your God is with you wherever you go.',
    translation: 'NLT',
  },
  {
    book: 'Psalm',
    chapter: 23,
    verses: '1-4',
    text: 'The Lord is my shepherd; I have all that I need. He lets me rest in green meadows; he leads me beside peaceful streams. He renews my strength. He guides me along right paths, bringing honor to his name. Even when I walk through the darkest valley, I will not be afraid, for you are close beside me.',
    translation: 'NLT',
  },
  {
    book: 'Matthew',
    chapter: 11,
    verses: '28',
    text: 'Then Jesus said, "Come to me, all of you who are weary and carry heavy burdens, and I will give you rest."',
    translation: 'NLT',
  },
  {
    book: '1 John',
    chapter: 4,
    verses: '7-8',
    text: 'Dear friends, let us continue to love one another, for love comes from God. Anyone who loves is a child of God and knows God. But anyone who does not love does not know God, for God is love.',
    translation: 'NLT',
  },
  {
    book: 'Jeremiah',
    chapter: 29,
    verses: '11',
    text: '"For I know the plans I have for you," says the Lord. "They are plans for good and not for disaster, to give you a future and a hope."',
    translation: 'NLT',
  },
  {
    book: 'Psalm',
    chapter: 27,
    verses: '1',
    text: 'The Lord is my light and my salvation—so why should I be afraid? The Lord is my fortress, protecting me from danger, so why should I tremble?',
    translation: 'NLT',
  },
  {
    book: 'Proverbs',
    chapter: 17,
    verses: '22',
    text: 'A cheerful heart is good medicine, but a broken spirit saps a person\'s strength.',
    translation: 'NLT',
  },
  {
    book: 'Colossians',
    chapter: 3,
    verses: '12-14',
    text: 'Since God chose you to be the holy people he loves, you must clothe yourselves with tenderhearted mercy, kindness, humility, gentleness, and patience. Make allowance for each other\'s faults, and forgive anyone who offends you. Remember, the Lord forgave you, so you must forgive others. Above all, clothe yourselves with love, which binds us all together in perfect harmony.',
    translation: 'NLT',
  },
  {
    book: 'Deuteronomy',
    chapter: 31,
    verses: '6',
    text: 'So be strong and courageous! Do not be afraid and do not panic before them. For the Lord your God will personally go ahead of you. He will neither fail you nor abandon you.',
    translation: 'NLT',
  },
  {
    book: '1 Peter',
    chapter: 5,
    verses: '7',
    text: 'Give all your worries and cares to God, for he cares about you.',
    translation: 'NLT',
  },
  {
    book: 'Psalm',
    chapter: 37,
    verses: '4',
    text: 'Take delight in the Lord, and he will give you your heart\'s desires.',
    translation: 'NLT',
  },
  {
    book: 'Isaiah',
    chapter: 40,
    verses: '31',
    text: 'But those who trust in the Lord will find new strength. They will soar high on wings like eagles. They will run and not grow weary. They will walk and not faint.',
    translation: 'NLT',
  },
  {
    book: 'Ephesians',
    chapter: 3,
    verses: '20-21',
    text: 'Now all glory to God, who is able, through his mighty power at work within us, to accomplish infinitely more than we might ask or think. Glory to him in the church and in Christ Jesus through all generations forever and ever! Amen.',
    translation: 'NLT',
  },
  {
    book: 'Proverbs',
    chapter: 22,
    verses: '19',
    text: 'So listen, my child, and do as I say, and the path of your life will be smooth.',
    translation: 'NLT',
  },
  {
    book: 'Hebrews',
    chapter: 10,
    verses: '35-36',
    text: 'So do not throw away this confident trust in the Lord. Remember the great reward it brings you! Patient endurance is what you need now, so that you will continue to do God\'s will. Then you will receive all that he has promised.',
    translation: 'NLT',
  },
  {
    book: 'Psalm',
    chapter: 118,
    verses: '24',
    text: 'This is the day the Lord has made. We will rejoice and be glad in it.',
    translation: 'NLT',
  },
  {
    book: '2 Corinthians',
    chapter: 12,
    verses: '9-10',
    text: 'Each time he said, "My grace is all you need. My power works best in weakness." So now I am glad to boast about my weaknesses, so that the power of Christ can work through me. That\'s why I take pleasure in my weaknesses, and in the insults, hardships, persecutions, and troubles that I suffer for Christ. For when I am weak, then I am strong.',
    translation: 'NLT',
  },
  {
    book: 'Romans',
    chapter: 15,
    verses: '13',
    text: 'I pray that God, the source of hope, will fill you completely with joy and peace because you trust in him. Then you will overflow with confident hope through the power of the Holy Spirit.',
    translation: 'NLT',
  },
  {
    book: 'Proverbs',
    chapter: 31,
    verses: '8-9',
    text: 'Speak up for those who cannot speak for themselves; ensure justice for those being crushed. Yes, speak up for the poor and helpless, and see that they get justice.',
    translation: 'NLT',
  },
  {
    book: 'Titus',
    chapter: 2,
    verses: '11-12',
    text: 'For the grace of God has been revealed, bringing salvation to all people. And we are instructed to turn from godless living and sinful pleasures. We should live in this evil world with wisdom, righteousness, and devotion to God.',
    translation: 'NLT',
  },
  {
    book: '2 Timothy',
    chapter: 1,
    verses: '7',
    text: 'For God has not given us a spirit of fear and timidity, but of power, love, and self-discipline.',
    translation: 'NLT',
  },
  {
    book: 'Proverbs',
    chapter: 11,
    verses: '25',
    text: 'The generous will prosper; those who refresh others will themselves be refreshed.',
    translation: 'NLT',
  },
  {
    book: '1 Thessalonians',
    chapter: 5,
    verses: '16-18',
    text: 'Always be joyful. Never stop praying. Be thankful in all circumstances, for this is God\'s will for you who belong to Christ Jesus.',
    translation: 'NLT',
  },
  {
    book: 'Proverbs',
    chapter: 8,
    verses: '11',
    text: 'Wisdom is more valuable than precious rubies. Nothing you desire can compare with it.',
    translation: 'NLT',
  },
  {
    book: '1 Corinthians',
    chapter: 13,
    verses: '4-7',
    text: 'Love is patient and kind. It is not jealous or boastful or proud or rude. It does not demand its own way. It is not irritable, and it keeps no record of being wronged. It does not rejoice about injustice but rejoices whenever the truth wins out. Love never gives up, never loses faith, is always hopeful, and endures through every circumstance.',
    translation: 'NLT',
  },
  {
    book: 'Psalm',
    chapter: 139,
    verses: '14',
    text: 'Thank you for making me so wonderfully complex! Your workmanship is marvelous—how well I know it.',
    translation: 'NLT',
  },
]

async function seedScriptures() {
  try {
    console.log('Starting to seed scriptures...')

    // Insert scriptures
    const { error } = await supabaseAdmin.from('scriptures').insert(
      encouragingScriptures.map((scripture, index) => ({
        ...scripture,
        display_order: index,
      }))
    )

    if (error) {
      console.error('Error inserting scriptures:', error)
      return
    }

    console.log(`Successfully seeded ${encouragingScriptures.length} scriptures!`)
    console.log('Next steps:')
    console.log('1. Set up a cron job or scheduled function to generate AI backgrounds')
    console.log('2. Configure your domain to point to your hosting provider')
    console.log('3. Set up ADMIN_SECRET_KEY environment variable for admin access')
  } catch (error) {
    console.error('Error seeding database:', error)
  }
}

seedScriptures()
