const db = require('../config/database');
const bcrypt = require('bcryptjs');

// User Model - handles user operations
class UserModel {
    // Create new user
    async create(userData) {
        const {
            username,
            email,
            password,
            first_name,
            last_name,
            phone,
            role_id = 3 // Default to 'User' role
        } = userData;

        // Hash password
        const password_hash = await bcrypt.hash(password, parseInt(process.env.BCRYPT_ROUNDS) || 12);

        const sql = `
            INSERT INTO users 
            (username, email, password_hash, first_name, last_name, phone, role_id)
            VALUES (?, ?, ?, ?, ?, ?, ?)
        `;
        
        const result = await db.query(sql, [
            username, email, password_hash, first_name, last_name, phone, role_id
        ]);

        return this.getById(result.insertId);
    }

    // Get user by ID
    async getById(userId) {
        const sql = `
            SELECT 
                u.user_id,
                u.username,
                u.email,
                u.first_name,
                u.last_name,
                u.phone,
                u.is_active,
                u.email_verified,
                u.last_login,
                u.created_at,
                r.role_name
            FROM users u
            JOIN user_roles r ON u.role_id = r.role_id
            WHERE u.user_id = ?
        `;
        
        const results = await db.query(sql, [userId]);
        return results[0] || null;
    }

    // Get user by email
    async getByEmail(email) {
        const sql = `
            SELECT 
                u.*,
                r.role_name
            FROM users u
            JOIN user_roles r ON u.role_id = r.role_id
            WHERE u.email = ? AND u.is_active = TRUE
        `;
        
        const results = await db.query(sql, [email]);
        return results[0] || null;
    }

    // Get user by username
    async getByUsername(username) {
        const sql = `
            SELECT 
                u.*,
                r.role_name
            FROM users u
            JOIN user_roles r ON u.role_id = r.role_id
            WHERE u.username = ? AND u.is_active = TRUE
        `;
        
        const results = await db.query(sql, [username]);
        return results[0] || null;
    }

    // Validate user password
    async validatePassword(password, hashedPassword) {
        return await bcrypt.compare(password, hashedPassword);
    }

    // Update user login timestamp
    async updateLastLogin(userId) {
        const sql = 'UPDATE users SET last_login = NOW() WHERE user_id = ?';
        await db.query(sql, [userId]);
    }

    // Get all users (admin only)
    async getAll(limit = 50, offset = 0) {
        const sql = `
            SELECT 
                u.user_id,
                u.username,
                u.email,
                u.first_name,
                u.last_name,
                u.phone,
                u.is_active,
                u.email_verified,
                u.last_login,
                u.created_at,
                r.role_name
            FROM users u
            JOIN user_roles r ON u.role_id = r.role_id
            ORDER BY u.created_at DESC
            LIMIT ? OFFSET ?
        `;
        
        return await db.query(sql, [limit, offset]);
    }

    // Update user profile
    async updateProfile(userId, updateData) {
        const allowedFields = ['first_name', 'last_name', 'phone', 'email'];
        const fields = [];
        const values = [];
        
        for (const [key, value] of Object.entries(updateData)) {
            if (allowedFields.includes(key) && value !== undefined) {
                fields.push(`${key} = ?`);
                values.push(value);
            }
        }
        
        if (fields.length === 0) {
            throw new Error('No valid fields to update');
        }
        
        values.push(userId);
        const sql = `UPDATE users SET ${fields.join(', ')}, updated_at = NOW() WHERE user_id = ?`;
        
        await db.query(sql, values);
        return this.getById(userId);
    }

    // Change user password
    async changePassword(userId, newPassword) {
        const password_hash = await bcrypt.hash(newPassword, parseInt(process.env.BCRYPT_ROUNDS) || 12);
        const sql = 'UPDATE users SET password_hash = ?, updated_at = NOW() WHERE user_id = ?';
        await db.query(sql, [password_hash, userId]);
    }

    // Get user roles
    async getRoles() {
        return await db.query('SELECT * FROM user_roles ORDER BY role_name');
    }

    // Check if email exists
    async emailExists(email, excludeUserId = null) {
        let sql = 'SELECT COUNT(*) as count FROM users WHERE email = ?';
        const params = [email];
        
        if (excludeUserId) {
            sql += ' AND user_id != ?';
            params.push(excludeUserId);
        }
        
        const result = await db.query(sql, params);
        return result[0].count > 0;
    }

    // Check if username exists
    async usernameExists(username, excludeUserId = null) {
        let sql = 'SELECT COUNT(*) as count FROM users WHERE username = ?';
        const params = [username];
        
        if (excludeUserId) {
            sql += ' AND user_id != ?';
            params.push(excludeUserId);
        }
        
        const result = await db.query(sql, params);
        return result[0].count > 0;
    }
}

module.exports = new UserModel();
