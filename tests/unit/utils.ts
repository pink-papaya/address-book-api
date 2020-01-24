import { Request, Response } from 'express';

export const mockExpressResponse = (): Response => {
  const response: Partial<Response> = {};

  response.status = jest.fn().mockReturnValue(response);
  response.json = jest.fn().mockReturnValue(response);

  return response as Response;
};

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const mockExpressRequest = (body?: unknown): Request | any => {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const request: Request | any = {
    body,
  };

  request.log = { error: jest.fn() };

  return request;
};
