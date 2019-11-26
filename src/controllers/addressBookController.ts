import { Request, Response } from 'express';
import { AddressBook } from '@/dataTypes';
import pool from '@/db/pool';
import ApiResponse from '@/misc/ApiResponse';

const baseSelectQuery = `
  SELECT
    *, 
    coalesce(
      (
        SELECT array_to_json(array_agg(row_to_json(x)))
        FROM (
          SELECT name, phone, picture_url AS pictureUrl, group_id AS groupId
          FROM contact c
          WHERE c.address_book_id = ab.id
        ) x
      ),
      '[]'
    ) AS contacts, 
    coalesce(
      (
        SELECT array_to_json(array_agg(row_to_json(x)))
        FROM (
          SELECT name, description, picture_url AS pictureUrl
          FROM contact_group g
          WHERE g.address_book_id = ab.id
        ) x
      ),
      '[]'
    ) AS groups
  FROM address_book ab
`;

export default {
  getAll(request: Request, response: Response): void {
    pool
      .query(baseSelectQuery)
      .then(results => {
        response
          .status(200)
          .json(new ApiResponse<AddressBook[]>(true, results.rows));
      })
      .catch(() => {
        response.status(500).json(new ApiResponse(false));
      });
  },

  getById(request: Request, response: Response): void {
    const id = parseInt(request.params.id, 10);

    pool
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
      .catch(() => {
        response.status(500).json(new ApiResponse(false));
      });
  },

  create(request: Request, response: Response): void {
    const { username, password } = request.body;

    pool
      .query(
        'INSERT INTO address_book (username, password) VALUES ($1, $2) RETURNING *',
        [username, password],
      )
      .then(results => {
        response
          .status(200)
          .json(new ApiResponse<AddressBook>(true, results.rows[0]));
      })
      .catch(() => {
        response.status(500).json(new ApiResponse(false));
      });
  },

  update(request: Request, response: Response): void {
    const id = parseInt(request.params.id, 10);
    const { password } = request.body;

    pool
      .query(
        'UPDATE address_book SET password = $1 WHERE id = $2 RETURNING *',
        [password, id],
      )
      .then(results => {
        response
          .status(200)
          .json(new ApiResponse<AddressBook>(true, results.rows[0]));
      })
      .catch(() => {
        response.status(500).json(new ApiResponse(false));
      });
  },

  delete(request: Request, response: Response): void {
    const id = parseInt(request.params.id, 10);

    pool
      .query('DELETE FROM address_book WHERE id = $1', [id])
      .then(() => {
        response.status(200).json(new ApiResponse(true));
      })
      .catch(() => {
        response.status(500).json(new ApiResponse(false));
      });
  },
};
