import addressBookController from '@/controllers/addressBookController';
import { mockExpressRequest, mockExpressResponse } from '../utils';
import pool from '@/db/pool';
import ApiResponse from '@/misc/ApiResponse';

jest.mock('pg');

afterEach(() => {
  jest.clearAllMocks();
});

const query = pool.query as jest.Mock;
const response = mockExpressResponse();

describe('addressBookController', () => {
  describe('getAll', () => {
    it('returns a 200 response with the db rows', async () => {
      const data = { rows: 'rows' };
      query.mockReturnValue(Promise.resolve(data));

      const request = mockExpressRequest();
      await addressBookController.getAll(request, response);

      expect(response.status).toHaveBeenCalledWith(200);
      expect(response.json).toHaveBeenCalledWith(
        new ApiResponse(true, data.rows),
      );

      expect(request.log.error).toHaveBeenCalledTimes(0);
    });

    it('returns a 500 error response when the query fails', async () => {
      const error = 'error';
      query.mockReturnValue(Promise.reject(error));

      const request = mockExpressRequest();
      await addressBookController.getAll(request, response);

      expect(response.status).toHaveBeenCalledWith(500);
      expect(response.json).toHaveBeenCalledWith(new ApiResponse(false));

      expect(request.log.error).toHaveBeenCalledTimes(1);
      expect(request.log.error).toHaveBeenCalledWith(error);
    });
  });

  describe('getById', () => {
    it('returns a 200 response with the record when it exists', async () => {
      const data = { rows: ['row1'], rowCount: 1 };
      const id = 1234567890;
      query.mockReturnValue(Promise.resolve(data));

      const request = mockExpressRequest({ id });

      await addressBookController.getById(request, response);

      expect(query).toHaveBeenCalledWith(expect.any(String), [id]);
      expect(response.status).toHaveBeenCalledWith(200);
      expect(response.status).toHaveBeenCalledTimes(1);

      expect(response.json).toHaveBeenCalledWith(
        new ApiResponse(true, data.rows[0]),
      );
      expect(response.json).toHaveBeenCalledTimes(1);

      expect(request.log.error).toHaveBeenCalledTimes(0);
    });

    it("returns a 404 response when the record doesn't exist", async () => {
      const data = { rows: [], rowCount: 0 };
      query.mockReturnValue(Promise.resolve(data));

      const request = mockExpressRequest();

      await addressBookController.getById(request, response);

      expect(response.status).toHaveBeenCalledWith(404);
      expect(response.status).toHaveBeenCalledTimes(1);

      expect(response.send).toHaveBeenCalledTimes(1);
      expect(response.send).toHaveBeenCalled();

      expect(request.log.error).toHaveBeenCalledTimes(0);
    });

    it('returns a 500 error response when the query fails', async () => {
      const error = 'error';
      query.mockReturnValue(Promise.reject(error));

      const request = mockExpressRequest();
      await addressBookController.getById(request, response);

      expect(response.status).toHaveBeenCalledWith(500);
      expect(response.status).toHaveBeenCalledTimes(1);

      expect(response.json).toHaveBeenCalledWith(new ApiResponse(false));
      expect(response.json).toHaveBeenCalledTimes(1);

      expect(request.log.error).toHaveBeenCalledTimes(1);
      expect(request.log.error).toHaveBeenCalledWith(error);
    });
  });

  describe('create', () => {
    it('returns a 200 response with the record after inserting it', async () => {
      const data = { rows: ['row1'] };
      const username = 'user';
      const password = 'pass';

      query.mockReturnValue(Promise.resolve(data));

      const request = mockExpressRequest({}, { username, password });

      await addressBookController.create(request, response);

      expect(query).toHaveBeenCalledWith(expect.any(String), [
        username,
        password,
      ]);
      expect(response.status).toHaveBeenCalledWith(200);
      expect(response.status).toHaveBeenCalledTimes(1);

      expect(response.json).toHaveBeenCalledWith(
        new ApiResponse(true, data.rows[0]),
      );
      expect(response.json).toHaveBeenCalledTimes(1);

      expect(request.log.error).toHaveBeenCalledTimes(0);
    });

    it('returns a 500 error response when the query fails', async () => {
      const error = 'error';
      query.mockReturnValue(Promise.reject(error));

      const request = mockExpressRequest();
      await addressBookController.create(request, response);

      expect(response.status).toHaveBeenCalledWith(500);
      expect(response.status).toHaveBeenCalledTimes(1);

      expect(response.json).toHaveBeenCalledWith(new ApiResponse(false));
      expect(response.json).toHaveBeenCalledTimes(1);

      expect(request.log.error).toHaveBeenCalledTimes(1);
      expect(request.log.error).toHaveBeenCalledWith(error);
    });
  });

  describe('update', () => {
    it('returns a 200 response with the record after updating it', async () => {
      const data = { rows: ['row1'], rowCount: 1 };
      const id = 1234567890;
      const password = 'pass';

      query.mockReturnValue(Promise.resolve(data));

      const request = mockExpressRequest({ id }, { password });

      await addressBookController.update(request, response);

      expect(query).toHaveBeenCalledWith(expect.any(String), [password, id]);

      expect(response.status).toHaveBeenCalledWith(200);
      expect(response.status).toHaveBeenCalledTimes(1);

      expect(response.json).toHaveBeenCalledWith(
        new ApiResponse(true, data.rows[0]),
      );
      expect(response.json).toHaveBeenCalledTimes(1);

      expect(request.log.error).toHaveBeenCalledTimes(0);
    });

    it('returns a 500 error response when the query fails', async () => {
      const error = 'error';
      query.mockReturnValue(Promise.reject(error));

      const request = mockExpressRequest();
      await addressBookController.update(request, response);

      expect(response.status).toHaveBeenCalledWith(500);
      expect(response.status).toHaveBeenCalledTimes(1);

      expect(response.json).toHaveBeenCalledWith(new ApiResponse(false));
      expect(response.json).toHaveBeenCalledTimes(1);

      expect(request.log.error).toHaveBeenCalledTimes(1);
      expect(request.log.error).toHaveBeenCalledWith(error);
    });
  });

  describe('delete', () => {
    it('returns a 200 response when the record is deleted', async () => {
      const id = 1234567890;

      query.mockReturnValue(Promise.resolve());

      const request = mockExpressRequest({ id });

      await addressBookController.delete(request, response);

      expect(query).toHaveBeenCalledWith(expect.any(String), [id]);

      expect(response.status).toHaveBeenCalledWith(200);
      expect(response.status).toHaveBeenCalledTimes(1);

      expect(response.json).toHaveBeenCalledWith(new ApiResponse(true));
      expect(response.json).toHaveBeenCalledTimes(1);

      expect(request.log.error).toHaveBeenCalledTimes(0);
    });

    it('returns a 500 error response when the query fails', async () => {
      const error = 'error';
      query.mockReturnValue(Promise.reject(error));

      const request = mockExpressRequest();
      await addressBookController.delete(request, response);

      expect(response.status).toHaveBeenCalledWith(500);
      expect(response.status).toHaveBeenCalledTimes(1);

      expect(response.json).toHaveBeenCalledWith(new ApiResponse(false));
      expect(response.json).toHaveBeenCalledTimes(1);

      expect(request.log.error).toHaveBeenCalledTimes(1);
      expect(request.log.error).toHaveBeenCalledWith(error);
    });
  });
});
