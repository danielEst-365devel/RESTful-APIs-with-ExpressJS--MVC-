const db = require('../config/database');

// Equipment Model - handles equipment operations
class EquipmentModel {
    // Get all available equipment
    async getAvailable() {
        const sql = `
            SELECT 
                e.equipment_id,
                e.equipment_code,
                e.name,
                e.description,
                c.category_name,
                e.brand,
                e.model,
                e.condition_status,
                e.location,
                e.availability_status
            FROM equipment e
            JOIN equipment_categories c ON e.category_id = c.category_id
            WHERE e.availability_status = 'Available'
            AND e.condition_status NOT IN ('Poor', 'Needs Repair')
            ORDER BY e.name
        `;
        return await db.query(sql);
    }

    // Get all equipment with pagination
    async getAll(limit = 50, offset = 0) {
        const sql = `
            SELECT 
                e.equipment_id,
                e.equipment_code,
                e.name,
                e.description,
                c.category_name,
                e.brand,
                e.model,
                e.condition_status,
                e.availability_status,
                e.location,
                e.created_at
            FROM equipment e
            JOIN equipment_categories c ON e.category_id = c.category_id
            ORDER BY e.name
            LIMIT ? OFFSET ?
        `;
        return await db.query(sql, [limit, offset]);
    }

    // Get equipment by ID
    async getById(equipmentId) {
        const sql = `
            SELECT 
                e.*,
                c.category_name
            FROM equipment e
            JOIN equipment_categories c ON e.category_id = c.category_id
            WHERE e.equipment_id = ?
        `;
        const results = await db.query(sql, [equipmentId]);
        return results[0] || null;
    }

    // Search equipment
    async search(searchTerm, categoryId = null) {
        let sql = `
            SELECT 
                e.equipment_id,
                e.equipment_code,
                e.name,
                e.description,
                c.category_name,
                e.brand,
                e.model,
                e.condition_status,
                e.availability_status,
                e.location
            FROM equipment e
            JOIN equipment_categories c ON e.category_id = c.category_id
            WHERE (e.name LIKE ? OR e.description LIKE ? OR e.equipment_code LIKE ?)
        `;
        
        const params = [`%${searchTerm}%`, `%${searchTerm}%`, `%${searchTerm}%`];
        
        if (categoryId) {
            sql += ' AND e.category_id = ?';
            params.push(categoryId);
        }
        
        sql += ' ORDER BY e.name';
        return await db.query(sql, params);
    }

    // Get equipment categories
    async getCategories() {
        const sql = 'SELECT * FROM equipment_categories ORDER BY category_name';
        return await db.query(sql);
    }

    // Update equipment availability
    async updateAvailability(equipmentId, status) {
        const sql = 'UPDATE equipment SET availability_status = ?, updated_at = NOW() WHERE equipment_id = ?';
        await db.query(sql, [status, equipmentId]);
    }
}

module.exports = new EquipmentModel();
