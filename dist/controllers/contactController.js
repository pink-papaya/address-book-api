"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const pool_1 = __importDefault(require("@/db/pool"));
const ApiResponse_1 = __importDefault(require("@/misc/ApiResponse"));
exports.default = {
    getAll(request, response) {
        const addressBookId = parseInt(request.params.addressBookId, 10);
        pool_1.default
            .query('SELECT * FROM contact WHERE address_book_id = $1', [
            addressBookId,
        ])
            .then(results => {
            response
                .status(200)
                .json(new ApiResponse_1.default(true, results.rows));
        })
            .catch(() => {
            response.status(500).json(new ApiResponse_1.default(false));
        });
    },
    getByName(request, response) {
        const id = parseInt(request.params.id, 10);
        const addressBookId = parseInt(request.params.addressBookId, 10);
        pool_1.default
            .query('SELECT * FROM contact WHERE name = $1 and address_book_id = $2', [
            request.params.name,
            addressBookId,
        ])
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
        const { name, phone, groupId, pictureUrl } = request.body;
        const addressBookId = parseInt(request.params.addressBookId, 10);
        console.log(request.params);
        pool_1.default
            .query('INSERT INTO contact (name, phone, picture_url, address_book_id, group_id) VALUES ($1, $2, $3, $4, $5) RETURNING *', [name, phone, pictureUrl, addressBookId, groupId])
            .then(results => {
            response
                .status(200)
                .json(new ApiResponse_1.default(true, results.rows[0]));
        })
            .catch((error) => {
            console.log(error);
            response.status(500).json(new ApiResponse_1.default(false));
        });
    },
    update(request, response) {
        const addressBookId = parseInt(request.params.addressBookId, 10);
        const { password } = request.body;
        pool_1.default
            .query('UPDATE contact SET password = $1 WHERE name = $2 RETURNING *', [
            password,
            request.params.name,
        ])
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
        const addressBookId = parseInt(request.params.addressBookId, 10);
        pool_1.default
            .query('DELETE FROM contact WHERE name = $1 AND address_book_id = $2', [
            request.params.name,
            addressBookId,
        ])
            .then(() => {
            response.status(200).json(new ApiResponse_1.default(true));
        })
            .catch(() => {
            response.status(500).json(new ApiResponse_1.default(false));
        });
    },
};
//# sourceMappingURL=contactController.js.map