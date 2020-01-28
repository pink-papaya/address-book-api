import addressBookController from '@/controllers/addressBookController';
import { mockExpressRequest, mockExpressResponse } from '../utils';
import pool from '@/db/pool';
import ApiResponse from '@/misc/ApiResponse';

jest.mock('pg');

afterEach(() => {
  jest.clearAllMocks();
});

const query = pool.query as jest.Mock;

describe('addressBookController', () => {
  describe('getAll', () => {
    it('returns a 200 response with the db rows', async () => {
      const data = { rows: 'rows' };
      query.mockReturnValue(Promise.resolve(data));

      const response = mockExpressResponse();
      const request = mockExpressRequest();
      await addressBookController.getAll(request, response);

      expect(response.status).toHaveBeenCalledWith(200);
      expect(response.json).toHaveBeenCalledWith(
        new ApiResponse(true, data.rows),
      );

      expect(request.log.error).toHaveBeenCalledTimes(0);
      expect(1).toBe(2);
    });

    it('returns a 200 response with the db rows', async () => {
      const error = 'error';
      query.mockReturnValue(Promise.reject(error));

      const response = mockExpressResponse();
      const request = mockExpressRequest();
      await addressBookController.getAll(request, response);

      expect(response.status).toHaveBeenCalledWith(500);
      expect(response.json).toHaveBeenCalledWith(new ApiResponse(false));

      expect(request.log.error).toHaveBeenCalledTimes(1);
      expect(request.log.error).toHaveBeenCalledWith(error);
    });
  });
});
