import { Request, Response } from 'express';
import { Contact } from '@/dataTypes';
import pool from '@/db/pool';
import ApiResponse from '@/misc/ApiResponse';

export const defaultFields =
  'id, name, description, picture_url as "pictureUrl"';

export default {
  getAll(request: Request, response: Response): void {
    const addressBookId = parseInt(request.params.addressBookId, 10);

    pool
      .query(
        `SELECT ${defaultFields} FROM contact_group WHERE address_book_id = $1`,
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

  getById(request: Request, response: Response): void {
    const id = parseInt(request.params.id, 10);
    const addressBookId = parseInt(request.params.addressBookId, 10);

    pool
      .query(
        `SELECT ${defaultFields} FROM contact_group WHERE id = $1 AND address_book_id = $2`,
        [id, addressBookId],
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
    const { id, name, description, pictureUrl } = request.body;
    const addressBookId = parseInt(request.params.addressBookId, 10);

    pool
      .query(
        `INSERT INTO contact_group (id, name, description, picture_url, address_book_id) 
          VALUES ($1, $2, $3, $4, $5) 
          RETURNING ${defaultFields}`,
        [id, name, description, pictureUrl, addressBookId],
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

  update(request: Request, response: Response): void {
    const id = parseInt(request.params.id, 10);
    const addressBookId = parseInt(request.params.addressBookId, 10);
    const { name, description, pictureUrl } = request.body;

    pool
      .query(
        `UPDATE contact_group SET name = $1, description = $2, picture_url = $3 
          WHERE id = $4 AND address_book_id = $5 
          RETURNING ${defaultFields}`,
        [name, description, pictureUrl, id, addressBookId],
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
    const id = parseInt(request.params.id, 10);
    const addressBookId = parseInt(request.params.addressBookId, 10);

    pool
      .query(
        'DELETE FROM contact_group WHERE id = $1 AND address_book_id = $2',
        [id, addressBookId],
      )
      .then(() => {
        response.status(200).json(new ApiResponse(true));
      })
      .catch(error => {
        request.log.error(error);
        response.status(500).json(new ApiResponse(false));
      });
  },
};
