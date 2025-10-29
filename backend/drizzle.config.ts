import type { Config } from 'drizzle-kit';

// Drizzle-kit doesn't load .env automatically
// You need to hardcode values or use connectionString
export default {
  schema: './src/db/schema.ts',
  out: './drizzle',
  driver: 'mysql2',
  dbCredentials: {
    // Option 1: Use connection string (RECOMMENDED)
    uri: 'mysql://ukedvrroz7sdyq0q:pQ1RB0P6w23HuMuXfIwb@bm7ibyhsp2hyaavwdzmm-mysql.services.clever-cloud.com:3306/bm7ibyhsp2hyaavwdzmm',
    
    // Option 2: Individual credentials (comment out uri above if using this)
    // host: 'bm7ibyhsp2hyaavwdzmm-mysql.services.clever-cloud.com',
    // port: 3306,
    // user: 'ukedvrroz7sdyq0q',
    // password: 'pQ1RB0P6w23HuMuXfIwb',
    // database: 'bm7ibyhsp2hyaavwdzmm',
  },
} satisfies Config;