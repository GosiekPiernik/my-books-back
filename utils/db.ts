import {createPool} from "mysql2/promise";

export const pool = createPool({
    host: 'localhost',
    user: 'root',
    database: 'my_books',
    namedPlaceholders: true,
    decimalNumbers: true,
})