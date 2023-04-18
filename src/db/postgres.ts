import { Pool } from 'pg';

const PGUSER = 'postgres'
const PGDATABASE = 'postgres'
const PGPASSWORD = 'admin'
const PGHOST = 'localhost'
const PGPORT = 5432

const config = {
    // user: PGUSER,
    // database: PGDATABASE,
    // password: PGPASSWORD,
    // host: PGHOST,
    // port: PGPORT,
    // //ssl: { rejectUnauthorized: false }
    ssl: false,
    connectionString: `postgres://postgres:admin@localhost:5432/postgres`
}

const pool = new Pool(config)

export { pool }
