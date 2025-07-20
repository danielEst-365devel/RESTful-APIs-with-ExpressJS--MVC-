const db = require('../config/database');

// Reservation Model - handles reservation operations
class ReservationModel {
    // Create new reservation
    async create(reservationData) {
        const {
            equipment_id,
            user_id,
            start_date,
            end_date,
            purpose,
            special_instructions
        } = reservationData;

        // Get pending status ID
        const statusResult = await db.query(
            'SELECT status_id FROM reservation_statuses WHERE status_name = "Pending"'
        );
        const statusId = statusResult[0].status_id;

        const sql = `
            INSERT INTO reservations 
            (equipment_id, user_id, start_date, end_date, purpose, special_instructions, status_id)
            VALUES (?, ?, ?, ?, ?, ?, ?)
        `;
        
        const result = await db.query(sql, [
            equipment_id, user_id, start_date, end_date, 
            purpose, special_instructions, statusId
        ]);

        // Update equipment availability
        await db.query(
            'UPDATE equipment SET availability_status = "Reserved" WHERE equipment_id = ?',
            [equipment_id]
        );

        return this.getById(result.insertId);
    }

    // Get reservation by ID
    async getById(reservationId) {
        const sql = `
            SELECT 
                r.*,
                e.equipment_code,
                e.name as equipment_name,
                e.description as equipment_description,
                c.category_name,
                CONCAT(u.first_name, ' ', u.last_name) as user_name,
                u.email as user_email,
                rs.status_name,
                CONCAT(approver.first_name, ' ', approver.last_name) as approved_by_name
            FROM reservations r
            JOIN equipment e ON r.equipment_id = e.equipment_id
            JOIN equipment_categories c ON e.category_id = c.category_id
            JOIN users u ON r.user_id = u.user_id
            JOIN reservation_statuses rs ON r.status_id = rs.status_id
            LEFT JOIN users approver ON r.approved_by = approver.user_id
            WHERE r.reservation_id = ?
        `;
        
        const results = await db.query(sql, [reservationId]);
        return results[0] || null;
    }

    // Get user reservations
    async getByUserId(userId, limit = 20, offset = 0) {
        const sql = `
            SELECT 
                r.*,
                e.equipment_code,
                e.name as equipment_name,
                rs.status_name
            FROM reservations r
            JOIN equipment e ON r.equipment_id = e.equipment_id
            JOIN reservation_statuses rs ON r.status_id = rs.status_id
            WHERE r.user_id = ?
            ORDER BY r.reservation_date DESC
            LIMIT ? OFFSET ?
        `;
        
        return await db.query(sql, [userId, limit, offset]);
    }

    // Get all reservations with filters
    async getAll(filters = {}, limit = 50, offset = 0) {
        let sql = `
            SELECT 
                r.*,
                e.equipment_code,
                e.name as equipment_name,
                CONCAT(u.first_name, ' ', u.last_name) as user_name,
                u.email as user_email,
                rs.status_name
            FROM reservations r
            JOIN equipment e ON r.equipment_id = e.equipment_id
            JOIN users u ON r.user_id = u.user_id
            JOIN reservation_statuses rs ON r.status_id = rs.status_id
            WHERE 1=1
        `;
        
        const params = [];
        
        if (filters.status) {
            sql += ' AND rs.status_name = ?';
            params.push(filters.status);
        }
        
        if (filters.equipment_id) {
            sql += ' AND r.equipment_id = ?';
            params.push(filters.equipment_id);
        }
        
        if (filters.user_id) {
            sql += ' AND r.user_id = ?';
            params.push(filters.user_id);
        }
        
        if (filters.date_from) {
            sql += ' AND r.start_date >= ?';
            params.push(filters.date_from);
        }
        
        if (filters.date_to) {
            sql += ' AND r.end_date <= ?';
            params.push(filters.date_to);
        }
        
        sql += ' ORDER BY r.reservation_date DESC LIMIT ? OFFSET ?';
        params.push(limit, offset);
        
        return await db.query(sql, params);
    }

    // Update reservation status
    async updateStatus(reservationId, statusName, approvedBy = null) {
        // Get status ID
        const statusResult = await db.query(
            'SELECT status_id FROM reservation_statuses WHERE status_name = ?',
            [statusName]
        );
        
        if (statusResult.length === 0) {
            throw new Error('Invalid status name');
        }
        
        const statusId = statusResult[0].status_id;
        
        let sql = 'UPDATE reservations SET status_id = ?, updated_at = NOW()';
        const params = [statusId];
        
        if (approvedBy && statusName === 'Approved') {
            sql += ', approved_by = ?, approval_date = NOW()';
            params.push(approvedBy);
        }
        
        sql += ' WHERE reservation_id = ?';
        params.push(reservationId);
        
        await db.query(sql, params);
        
        // Update equipment availability based on status
        if (statusName === 'Approved') {
            const reservation = await this.getById(reservationId);
            await db.query(
                'UPDATE equipment SET availability_status = "Reserved" WHERE equipment_id = ?',
                [reservation.equipment_id]
            );
        } else if (statusName === 'Active') {
            const reservation = await this.getById(reservationId);
            await db.query(
                'UPDATE equipment SET availability_status = "In Use" WHERE equipment_id = ?',
                [reservation.equipment_id]
            );
        } else if (['Completed', 'Cancelled'].includes(statusName)) {
            const reservation = await this.getById(reservationId);
            await db.query(
                'UPDATE equipment SET availability_status = "Available" WHERE equipment_id = ?',
                [reservation.equipment_id]
            );
        }
        
        return this.getById(reservationId);
    }

    // Check equipment availability for date range
    async checkAvailability(equipmentId, startDate, endDate, excludeReservationId = null) {
        let sql = `
            SELECT COUNT(*) as conflict_count
            FROM reservations r
            JOIN reservation_statuses rs ON r.status_id = rs.status_id
            WHERE r.equipment_id = ?
            AND rs.status_name IN ('Approved', 'Active')
            AND (
                (r.start_date <= ? AND r.end_date >= ?) OR
                (r.start_date <= ? AND r.end_date >= ?) OR
                (r.start_date >= ? AND r.end_date <= ?)
            )
        `;
        
        const params = [equipmentId, startDate, startDate, endDate, endDate, startDate, endDate];
        
        if (excludeReservationId) {
            sql += ' AND r.reservation_id != ?';
            params.push(excludeReservationId);
        }
        
        const result = await db.query(sql, params);
        return result[0].conflict_count === 0;
    }

    // Get reservation statuses
    async getStatuses() {
        return await db.query('SELECT * FROM reservation_statuses ORDER BY status_name');
    }
}

module.exports = new ReservationModel();
