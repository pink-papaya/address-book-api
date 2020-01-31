import { Request, Response } from 'express';
import { AddressBook } from '@/dataTypes';
import pool from '@/db/pool';
import ApiResponse from '@/misc/ApiResponse';

import { defaultFields as contactDefaultFields } from '@/controllers/contactController';
import { defaultFields as contactGroupDefaultFields } from '@/controllers/contactGroupController';

const defaultFields = `
  *,
  coalesce(
    (
      SELECT array_to_json(array_agg(row_to_json(x)))
      FROM (
        SELECT ${contactDefaultFields}
        FROM contact c
        WHERE c.address_book_id = address_book.id
      ) x
    ),
    '[]'
  ) AS contacts,
  coalesce(
    (
      SELECT array_to_json(array_agg(row_to_json(y)))
      FROM (
        SELECT ${contactGroupDefaultFields}
        FROM contact_group g
        WHERE g.address_book_id = address_book.id
      ) y
    ),
    '[]'
  ) AS groups
`;
const baseSelectQuery = `
  SELECT ${defaultFields}
  FROM address_book
`;

export default {
  getAll(request: Request, response: Response): Promise<void> {
    return pool
      .query(baseSelectQuery)
      .then(results => {
        response
          .status(200)
          .json(new ApiResponse<AddressBook[]>(true, results.rows));
      })
      .catch(error => {
        request.log.error(error);
        response.status(500).json(new ApiResponse(false));
      });
  },

  getById(request: Request, response: Response): Promise<void> {
    const id = parseInt(request.params.id, 10);

    return pool
      .query(`${baseSelectQuery} WHERE id = $1`, [id])
      .then(results => {
        if (!results.rowCount) {
          response.status(404).send();
          return;
        }

        response
          .status(200)
          .json(new ApiResponse<AddressBook>(true, results.rows[0]));
      })
      .catch(error => {
        request.log.error(error);
        response.status(500).json(new ApiResponse(false));
      });
  },

  create(request: Request, response: Response): Promise<void> {
    const { username, password } = request.body;

    return pool
      .query(
        `INSERT INTO address_book (username, password) VALUES ($1, $2) RETURNING ${defaultFields}`,
        [username, password],
      )
      .then(results => {
        response
          .status(200)
          .json(new ApiResponse<AddressBook>(true, results.rows[0]));
      })
      .catch(error => {
        request.log.error(error);
        response.status(500).json(new ApiResponse(false));
      });
  },

  /**
   * Update an address book's password
   */
  update(request: Request, response: Response): Promise<void> {
    const id = parseInt(request.params.id, 10);
    const { password } = request.body;

    return pool
      .query(
        `UPDATE address_book SET password = $1 WHERE id = $2 RETURNING ${defaultFields}`,
        [password, id],
      )
      .then(results => {
        response
          .status(200)
          .json(new ApiResponse<AddressBook>(true, results.rows[0]));
      })
      .catch(error => {
        request.log.error(error);
        response.status(500).json(new ApiResponse(false));
      });
  },

  delete(request: Request, response: Response): Promise<void> {
    const id = parseInt(request.params.id, 10);

    return pool
      .query('DELETE FROM address_book WHERE id = $1', [id])
      .then(() => {
        response.status(200).json(new ApiResponse(true));
      })
      .catch(error => {
        request.log.error(error);
        response.status(500).json(new ApiResponse(false));
      });
  },
};
