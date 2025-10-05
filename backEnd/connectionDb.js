const sql = require('mssql');
require('dotenv').config();

const config = {
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    server: process.env.DB_SERVER,
    database: process.env.DB_NAME,
    options: {
        trustServerCertificate: true,
        encrypt: false
    }
};

let poolPromise;

async function connectDB() {
    try {
        if (!poolPromise) {
            poolPromise = await sql.connect(config);
            console.log('✅ Connected to MSSQL database');
        }
        return poolPromise;
    } catch (err) {
        console.error('❌ Database connection error:', err);
        process.exit(1);
    }
}

module.exports = {
    connectDB,
    sql
};
