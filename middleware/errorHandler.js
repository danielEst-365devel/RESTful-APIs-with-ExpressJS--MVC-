// Error handling middleware
const errorHandler = (err, req, res, next) => {
    console.error('Error stack:', err.stack);
    
    // Default error
    let error = {
        message: err.message || 'Something went wrong!',
        status: err.status || 500
    };

    // MySQL/Database errors
    if (err.code === 'ER_DUP_ENTRY') {
        error.message = 'Duplicate entry - this record already exists';
        error.status = 400;
    }
    
    if (err.code === 'ER_NO_REFERENCED_ROW_2') {
        error.message = 'Referenced record does not exist';
        error.status = 400;
    }
    
    if (err.code === 'ER_ROW_IS_REFERENCED_2') {
        error.message = 'Cannot delete - record is referenced by other data';
        error.status = 400;
    }
    
    if (err.code === 'ECONNREFUSED') {
        error.message = 'Database connection refused';
        error.status = 503;
    }

    // Mongoose validation error (if using MongoDB)
    if (err.name === 'ValidationError') {
        error.message = Object.values(err.errors).map(val => val.message).join(', ');
        error.status = 400;
    }

    // Mongoose duplicate key error (if using MongoDB)
    if (err.code === 11000) {
        error.message = 'Duplicate resource';
        error.status = 400;
    }

    // JWT errors
    if (err.name === 'JsonWebTokenError') {
        error.message = 'Invalid token';
        error.status = 401;
    }
    
    if (err.name === 'TokenExpiredError') {
        error.message = 'Token expired';
        error.status = 401;
    }

    // Validation errors
    if (err.name === 'ValidationError' || err.type === 'validation') {
        error.message = err.message;
        error.status = 400;
    }

    // Send error response
    res.status(error.status).json({
        success: false,
        error: error.message,
        ...(process.env.NODE_ENV === 'development' && { 
            stack: err.stack,
            code: err.code 
        })
    });
};

// Not found middleware
const notFound = (req, res, next) => {
    res.status(404).json({ 
        error: `Route ${req.originalUrl} not found` 
    });
};

// Request logging middleware
const requestLogger = (req, res, next) => {
    const timestamp = new Date().toISOString();
    console.log(`[${timestamp}] ${req.method} ${req.originalUrl} - ${req.ip}`);
    next();
};

// Request validation middleware
const validateRequest = (schema) => {
    return (req, res, next) => {
        const { error } = schema.validate(req.body);
        if (error) {
            return res.status(400).json({
                error: error.details[0].message
            });
        }
        next();
    };
};

module.exports = {
    errorHandler,
    notFound,
    requestLogger,
    validateRequest
};
