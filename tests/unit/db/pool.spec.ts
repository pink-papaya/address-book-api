import { Pool } from 'pg';

jest.mock('pg');

afterEach(() => {
  jest.resetAllMocks();
});

describe('pool', () => {
  it('should export a Pool instance with the environment database url ', () => {
    process.env.DATABASE_URL = 'string';

    return import('@/db/pool').then(() => {
      expect(Pool).toHaveBeenCalledWith({
        connectionString: process.env.DATABASE_URL,
      });
    });
  });
});
