import { db } from './connection';
import { moviesAndShows } from './schema';

const sampleData = [
  {
    title: 'The Shawshank Redemption',
    type: 'Movie' as const,
    director: 'Frank Darabont',
    budget: '25000000',
    location: 'Ohio, USA',
    duration: 142,
    year: 1994,
    description: 'Two imprisoned men bond over a number of years, finding solace and eventual redemption through acts of common decency.',
    rating: '9.3',
    genre: 'Drama',
    status: 'completed' as const,
  },
  {
    title: 'Breaking Bad',
    type: 'TV Show' as const,
    director: 'Vince Gilligan',
    budget: '3000000',
    location: 'Albuquerque, New Mexico',
    duration: 47,
    year: 2008,
    timeRange: '2008-2013',
    description: 'A high school chemistry teacher turned methamphetamine producer partners with a former student.',
    rating: '9.5',
    genre: 'Crime, Drama, Thriller',
    status: 'completed' as const,
  },
  {
    title: 'The Dark Knight',
    type: 'Movie' as const,
    director: 'Christopher Nolan',
    budget: '185000000',
    location: 'Chicago, Illinois',
    duration: 152,
    year: 2008,
    description: 'When the menace known as the Joker wreaks havoc and chaos on the people of Gotham, Batman must accept one of the greatest psychological and physical tests.',
    rating: '9.0',
    genre: 'Action, Crime, Drama',
    status: 'completed' as const,
  },
  {
    title: 'Stranger Things',
    type: 'TV Show' as const,
    director: 'The Duffer Brothers',
    budget: '8000000',
    location: 'Georgia, USA',
    duration: 51,
    year: 2016,
    timeRange: '2016-Present',
    description: 'When a young boy disappears, his mother, a police chief and his friends must confront terrifying supernatural forces.',
    rating: '8.7',
    genre: 'Drama, Fantasy, Horror',
    status: 'ongoing' as const,
  },
  {
    title: 'Inception',
    type: 'Movie' as const,
    director: 'Christopher Nolan',
    budget: '160000000',
    location: 'Multiple locations',
    duration: 148,
    year: 2010,
    description: 'A thief who steals corporate secrets through the use of dream-sharing technology is given the inverse task of planting an idea.',
    rating: '8.8',
    genre: 'Action, Sci-Fi, Thriller',
    status: 'completed' as const,
  },
];

const seedDatabase = async () => {
  try {
    console.log('🌱 Seeding database...');

    // Check if data already exists
    const existingData = await db.select().from(moviesAndShows);

    if (existingData.length > 0) {
      console.log('⚠️  Database already contains data. Skipping seed.');
      console.log(`   Found ${existingData.length} existing entries.`);
      return;
    }

    // Insert sample data
    await db.insert(moviesAndShows).values(sampleData);

    console.log('✅ Database seeded successfully!');
    console.log(`   Added ${sampleData.length} sample entries.`);
  } catch (error) {
    console.error('❌ Seeding failed:', error);
    throw error;
  }
};

seedDatabase()
  .then(() => {
    console.log('✨ Seeding complete!');
    process.exit(0);
  })
  .catch((error) => {
    console.error('Failed to seed database:', error);
    process.exit(1);
  });