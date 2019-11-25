"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const pg_1 = require("pg");
const connectionString = process.env.DATABASE_URL ||
    'postgresql://postgres:root@localhost:5432/address_book_api';
exports.default = new pg_1.Pool({
    connectionString,
});
//# sourceMappingURL=pool.js.map