import { Request, Response } from 'express';
import { AddressBook, Contact } from '@/dataTypes';
import pool from '@/db/pool';
import ApiResponse from '@/misc/ApiResponse';

const defaultFields =
  'name, phone, picture_url as pictureUrl, group_id as groupId';

export default {
  getAll(request: Request, response: Response): void {
    const addressBookId = parseInt(request.params.addressBookId, 10);

    pool
      .query(
        `SELECT ${defaultFields} FROM contact WHERE address_book_id = $1`,
        [addressBookId],
      )
      .then(results => {
        response
          .status(200)
          .json(new ApiResponse<Contact[]>(true, results.rows));
      })
      .catch(error => {
        request.log.error(error);
        response.status(500).json(new ApiResponse(false));
      });
  },

  getByName(request: Request, response: Response): void {
    const addressBookId = parseInt(request.params.addressBookId, 10);

    pool
      .query(
        `SELECT ${defaultFields} FROM contact WHERE name = $1 AND address_book_id = $2`,
        [request.params.name, addressBookId],
      )
      .then(results => {
        if (!results.rowCount) {
          response.status(404).send();
          return;
        }

        response
          .status(200)
          .json(new ApiResponse<Contact>(true, results.rows[0]));
      })
      .catch(error => {
        request.log.error(error);
        response.status(500).json(new ApiResponse(false));
      });
  },

  create(request: Request, response: Response): void {
    const { name, phone, groupId, pictureUrl } = request.body;
    const addressBookId = parseInt(request.params.addressBookId, 10);

    pool
      .query(
        `INSERT INTO contact (name, phone, picture_url, address_book_id, group_id) 
          VALUES ($1, $2, $3, $4, $5) 
          RETURNING ${defaultFields}`,
        [name, phone, pictureUrl, addressBookId, groupId],
      )
      .then(results => {
        response
          .status(200)
          .json(new ApiResponse<Contact>(true, results.rows[0]));
      })
      .catch(error => {
        response.status(500).json(new ApiResponse(false));
      });
  },

  update(request: Request, response: Response): void {
    const addressBookId = parseInt(request.params.addressBookId, 10);
    const { name, phone, pictureUrl, groupId } = request.body;

    pool
      .query(
        `UPDATE contact SET name = $1, phone = $2, picture_url = $3, group_id = $4 
          WHERE name = $5 AND address_book_id = $6 
          RETURNING ${defaultFields}`,
        [name, phone, pictureUrl, groupId, request.params.name, addressBookId],
      )
      .then(results => {
        response
          .status(200)
          .json(new ApiResponse<Contact>(true, results.rows[0]));
      })
      .catch(error => {
        request.log.error(error);
        response.status(500).json(new ApiResponse(false));
      });
  },

  delete(request: Request, response: Response): void {
    const addressBookId = parseInt(request.params.addressBookId, 10);

    pool
      .query('DELETE FROM contact WHERE name = $1 AND address_book_id = $2', [
        request.params.name,
        addressBookId,
      ])
      .then(() => {
        response.status(200).json(new ApiResponse(true));
      })
      .catch(error => {
        request.log.error(error);
        response.status(500).json(new ApiResponse(false));
      });
  },
};
