import { Pool } from 'pg';

const connectionString =
  process.env.DATABASE_URL ||
  'postgresql://postgres:root@localhost:5432/address_book_api';

export default new Pool({
  connectionString,
});
