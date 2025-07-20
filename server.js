require('dotenv').config();
const express = require('express');
const path = require('path');
const cors = require('cors');
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');

// Import database
const db = require('./config/database');

// Import routes
const indexRoutes = require('./routes/index');
const apiRoutes = require('./routes/api');

// Import middleware
const { errorHandler, notFound, requestLogger } = require('./middleware/errorHandler');

const app = express();
const PORT = process.env.PORT || 3000;

// Security middleware
app.use(helmet({
    contentSecurityPolicy: {
        directives: {
            defaultSrc: ["'self'"],
            styleSrc: ["'self'", "'unsafe-inline'"],
            scriptSrc: ["'self'"],
            imgSrc: ["'self'", "data:", "https:"],
        },
    },
}));

// CORS configuration
app.use(cors({
    origin: process.env.NODE_ENV === 'production' 
        ? ['https://yourdomain.com'] 
        : ['http://localhost:3000', 'http://127.0.0.1:3000'],
    credentials: true
}));

// Rate limiting
const limiter = rateLimit({
    windowMs: parseInt(process.env.RATE_LIMIT_WINDOW_MS) || 15 * 60 * 1000, // 15 minutes
    max: parseInt(process.env.RATE_LIMIT_MAX_REQUESTS) || 100, // limit each IP to 100 requests per windowMs
    message: {
        error: 'Too many requests from this IP, please try again later.'
    }
});
app.use('/api', limiter);

// Request logging middleware
if (process.env.NODE_ENV !== 'production') {
    app.use(requestLogger);
}

// Middleware to serve static files (HTML, CSS, JS)
app.use(express.static(path.join(__dirname, 'public')));

// Middleware to parse JSON bodies
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Routes
app.use('/', indexRoutes);
app.use('/api', apiRoutes);

// 404 handler - must be after all other routes
app.use(notFound);

// Error handler - must be last
app.use(errorHandler);

app.listen(PORT, async () => {
    console.log(`🚀 Equipment Reservation System Server started`);
    console.log(`📍 Server running on http://localhost:${PORT}`);
    console.log(`🌍 Environment: ${process.env.NODE_ENV || 'development'}`);
    
    // Test database connection
    try {
        const dbConnected = await db.testConnection();
        if (dbConnected) {
            console.log('✅ Database connected successfully');
        } else {
            console.log('❌ Database connection failed');
        }
    } catch (error) {
        console.error('❌ Database connection error:', error.message);
    }
    
    console.log(`\n📋 Available API endpoints:`);
    console.log('   Health & System:');
    console.log('     GET    /api/health                    - Server and database status');
    console.log('     GET    /api/system/status             - Detailed system status');
    console.log('   Equipment:');
    console.log('     GET    /api/equipment                 - Get available equipment');
    console.log('     GET    /api/equipment/all             - Get all equipment');
    console.log('     GET    /api/equipment/search?q=term   - Search equipment');
    console.log('     GET    /api/equipment/categories      - Get equipment categories');
    console.log('     GET    /api/equipment/:id             - Get single equipment');
    console.log('   Reservations:');
    console.log('     GET    /api/reservations              - Get all reservations');
    console.log('     POST   /api/reservations              - Create new reservation');
    console.log('     GET    /api/reservations/my           - Get user reservations');
    console.log('     GET    /api/reservations/statuses     - Get reservation statuses');
    console.log('     GET    /api/reservations/:id          - Get single reservation');
    console.log('     PUT    /api/reservations/:id/status   - Update reservation status');
    console.log('\n📄 Frontend available at: http://localhost:' + PORT);
});
