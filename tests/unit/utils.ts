import { Request, Response } from 'express';

export const mockExpressResponse = (): Response => {
  const response: Partial<Response> = {};

  response.status = jest.fn().mockReturnValue(response);
  response.json = jest.fn().mockReturnValue(response);
  response.send = jest.fn().mockReturnValue(response);

  return response as Response;
};

/* eslint-disable @typescript-eslint/no-explicit-any */
export const mockExpressRequest = (
  params: { [key: string]: unknown } = {},
  body: { [key: string]: unknown } = {},
): Request | any => {
  const request: Request | any = {
    params,
    body,
  };

  request.log = { error: jest.fn() };

  return request;
};
