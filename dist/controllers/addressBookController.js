"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const pool_1 = __importDefault(require("@/db/pool"));
const ApiResponse_1 = __importDefault(require("@/misc/ApiResponse"));
exports.default = {
    getAll(request, response) {
        pool_1.default
            .query('SELECT * FROM address_book')
            .then(results => {
            response
                .status(200)
                .json(new ApiResponse_1.default(true, results.rows));
        })
            .catch(() => {
            response.status(500).json(new ApiResponse_1.default(false));
        });
    },
    getById(request, response) {
        const id = parseInt(request.params.id, 10);
        pool_1.default
            .query('SELECT * FROM address_book WHERE id = $1', [id])
            .then(results => {
            if (!results.rowCount) {
                response.status(404).send();
                return;
            }
            response
                .status(200)
                .json(new ApiResponse_1.default(true, results.rows[0]));
        })
            .catch(() => {
            response.status(500).json(new ApiResponse_1.default(false));
        });
    },
    create(request, response) {
        const { username, password } = request.body;
        pool_1.default
            .query('INSERT INTO address_book (username, password) VALUES ($1, $2) RETURNING *', [username, password])
            .then(results => {
            response
                .status(200)
                .json(new ApiResponse_1.default(true, results.rows[0]));
        })
            .catch(() => {
            response.status(500).json(new ApiResponse_1.default(false));
        });
    },
    update(request, response) {
        const id = parseInt(request.params.id, 10);
        const { password } = request.body;
        pool_1.default
            .query('UPDATE address_book SET password = $1 WHERE id = $2 RETURNING *', [password, id])
            .then(results => {
            response
                .status(200)
                .json(new ApiResponse_1.default(true, results.rows[0]));
        })
            .catch(() => {
            response.status(500).json(new ApiResponse_1.default(false));
        });
    },
    delete(request, response) {
        const id = parseInt(request.params.id, 10);
        pool_1.default
            .query('DELETE FROM address_book WHERE id = $1', [id])
            .then(() => {
            response.status(200).json(new ApiResponse_1.default(true));
        })
            .catch(() => {
            response.status(500).json(new ApiResponse_1.default(false));
        });
    },
};
//# sourceMappingURL=addressBookController.js.map