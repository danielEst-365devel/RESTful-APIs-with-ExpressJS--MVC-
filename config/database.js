const mysql = require('mysql2/promise');

// Database configuration
const dbConfig = {
    host: process.env.DB_HOST || 'localhost',
    port: process.env.DB_PORT || 3306,
    user: process.env.DB_USER || 'root',
    password: process.env.DB_PASSWORD || '',
    database: process.env.DB_NAME || 'equipment_reservation_system',
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0,
    acquireTimeout: 60000,
    timeout: 60000,
    multipleStatements: true
};

// Create connection pool
const pool = mysql.createPool(dbConfig);

// Database connection wrapper
class Database {
    constructor() {
        this.pool = pool;
    }

    // Execute query with parameters
    async query(sql, params = []) {
        try {
            const [rows] = await this.pool.execute(sql, params);
            return rows;
        } catch (error) {
            console.error('Database query error:', error);
            throw error;
        }
    }

    // Execute multiple queries in transaction
    async transaction(queries) {
        const connection = await this.pool.getConnection();
        try {
            await connection.beginTransaction();
            
            const results = [];
            for (const { sql, params } of queries) {
                const [rows] = await connection.execute(sql, params);
                results.push(rows);
            }
            
            await connection.commit();
            return results;
        } catch (error) {
            await connection.rollback();
            throw error;
        } finally {
            connection.release();
        }
    }

    // Test database connection
    async testConnection() {
        try {
            const [rows] = await this.pool.execute('SELECT 1 as connected');
            return rows[0].connected === 1;
        } catch (error) {
            console.error('Database connection test failed:', error);
            return false;
        }
    }

    // Close all connections
    async close() {
        await this.pool.end();
    }
}

// Export singleton instance
module.exports = new Database();
