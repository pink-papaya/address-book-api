import contactGroupController from '@/controllers/contactGroupController';
import pool from '@/db/pool';
import ApiResponse from '@/misc/ApiResponse';
import { mockExpressRequest, mockExpressResponse } from '../utils';

jest.mock('pg');

afterEach(() => {
  jest.clearAllMocks();
});

const query = pool.query as jest.Mock;
const response = mockExpressResponse();

describe('contactGroupController', () => {
  describe('getAll', () => {
    it('returns a 200 response with the contact groups of the given addressBookId', async () => {
      const data = { rows: 'rows' };
      query.mockReturnValue(Promise.resolve(data));

      const addressBookId = 1;
      const request = mockExpressRequest({ addressBookId });
      await contactGroupController.getAll(request, response);

      expect(query).toHaveBeenCalledWith(expect.any(String), [addressBookId]);

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
      await contactGroupController.getAll(request, response);

      expect(response.status).toHaveBeenCalledWith(500);
      expect(response.json).toHaveBeenCalledWith(new ApiResponse(false));

      expect(request.log.error).toHaveBeenCalledTimes(1);
      expect(request.log.error).toHaveBeenCalledWith(error);
    });
  });

  describe('getById', () => {
    it('returns a 200 response with the record when it exists', async () => {
      const data = { rows: ['row1'], rowCount: 1 };
      query.mockReturnValue(Promise.resolve(data));

      const id = 123;
      const addressBookId = 1;
      const request = mockExpressRequest({ addressBookId, id });

      await contactGroupController.getById(request, response);

      expect(query).toHaveBeenCalledWith(expect.any(String), [
        id,
        addressBookId,
      ]);
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

      await contactGroupController.getById(request, response);

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
      await contactGroupController.getById(request, response);

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

      query.mockReturnValue(Promise.resolve(data));

      const addressBookId = 1;
      const id = 123;
      const name = 'string1';
      const description = 'string2';
      const pictureUrl = 'string3';
      const request = mockExpressRequest(
        { addressBookId },
        {
          id,
          name,
          pictureUrl,
          description,
        },
      );

      await contactGroupController.create(request, response);

      expect(query).toHaveBeenCalledWith(expect.any(String), [
        id,
        name,
        description,
        pictureUrl,
        addressBookId,
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
      await contactGroupController.create(request, response);

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

      query.mockReturnValue(Promise.resolve(data));

      const addressBookId = 1;
      const id = 123;
      const name = 'string';
      const description = 'string1';
      const pictureUrl = 'string3';
      const request = mockExpressRequest(
        { id, addressBookId },
        {
          name,
          description,
          pictureUrl,
        },
      );

      await contactGroupController.update(request, response);

      expect(query).toHaveBeenCalledWith(expect.any(String), [
        name,
        description,
        pictureUrl,
        id,
        addressBookId,
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
      await contactGroupController.update(request, response);

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
      query.mockReturnValue(Promise.resolve());

      const addressBookId = 1;
      const id = 123;
      const request = mockExpressRequest({ addressBookId, id });

      await contactGroupController.delete(request, response);

      expect(query).toHaveBeenCalledWith(expect.any(String), [
        id,
        addressBookId,
      ]);

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
      await contactGroupController.delete(request, response);

      expect(response.status).toHaveBeenCalledWith(500);
      expect(response.status).toHaveBeenCalledTimes(1);

      expect(response.json).toHaveBeenCalledWith(new ApiResponse(false));
      expect(response.json).toHaveBeenCalledTimes(1);

      expect(request.log.error).toHaveBeenCalledTimes(1);
      expect(request.log.error).toHaveBeenCalledWith(error);
    });
  });
});
