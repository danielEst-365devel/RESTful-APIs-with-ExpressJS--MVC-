const db = require('../config/database');

// Health controller - handles server status endpoints
const healthController = {
    // GET /api/health - Check server and database status
    getHealth: async (req, res) => {
        try {
            // Test database connection
            const dbConnected = await db.testConnection();
            
            const healthData = {
                status: dbConnected ? 'OK' : 'WARNING',
                message: dbConnected ? 'Server and database are running!' : 'Server running but database connection failed',
                timestamp: new Date().toISOString(),
                services: {
                    server: 'OK',
                    database: dbConnected ? 'OK' : 'ERROR'
                },
                version: '1.0.0'
            };

            const statusCode = dbConnected ? 200 : 503;
            res.status(statusCode).json(healthData);
        } catch (error) {
            console.error('Health check error:', error);
            res.status(500).json({ 
                status: 'ERROR',
                message: 'Health check failed',
                timestamp: new Date().toISOString(),
                services: {
                    server: 'ERROR',
                    database: 'ERROR'
                },
                error: error.message
            });
        }
    },

    // GET /api/system/status - Detailed system status (admin only)
    getSystemStatus: async (req, res) => {
        try {
            const dbConnected = await db.testConnection();
            
            // Get some basic statistics
            let stats = {
                equipment_count: 0,
                active_reservations: 0,
                total_users: 0
            };

            if (dbConnected) {
                try {
                    const equipmentResult = await db.query('SELECT COUNT(*) as count FROM equipment');
                    const reservationsResult = await db.query(`
                        SELECT COUNT(*) as count FROM reservations r 
                        JOIN reservation_statuses rs ON r.status_id = rs.status_id 
                        WHERE rs.status_name IN ('Approved', 'Active')
                    `);
                    const usersResult = await db.query('SELECT COUNT(*) as count FROM users WHERE is_active = TRUE');
                    
                    stats = {
                        equipment_count: equipmentResult[0]?.count || 0,
                        active_reservations: reservationsResult[0]?.count || 0,
                        total_users: usersResult[0]?.count || 0
                    };
                } catch (statError) {
                    console.error('Error fetching statistics:', statError);
                }
            }

            res.json({
                status: dbConnected ? 'OK' : 'WARNING',
                message: 'System status retrieved successfully',
                timestamp: new Date().toISOString(),
                uptime: process.uptime(),
                memory_usage: process.memoryUsage(),
                services: {
                    server: 'OK',
                    database: dbConnected ? 'OK' : 'ERROR'
                },
                statistics: stats,
                environment: process.env.NODE_ENV || 'development'
            });
        } catch (error) {
            console.error('System status error:', error);
            res.status(500).json({ 
                status: 'ERROR',
                message: 'System status check failed',
                timestamp: new Date().toISOString(),
                error: error.message
            });
        }
    }
};

module.exports = healthController;
