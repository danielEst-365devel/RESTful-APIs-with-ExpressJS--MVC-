const ReservationModel = require('../models/reservationModel');
const EquipmentModel = require('../models/dataModel');

// Reservation controller - handles reservation management endpoints
const reservationController = {
    // POST /api/reservations - Create new reservation
    create: async (req, res) => {
        try {
            const {
                equipment_id,
                start_date,
                end_date,
                purpose,
                special_instructions
            } = req.body;

            // Validation
            if (!equipment_id || !start_date || !end_date) {
                return res.status(400).json({
                    success: false,
                    error: 'Equipment ID, start date, and end date are required'
                });
            }

            // Validate dates
            const startDate = new Date(start_date);
            const endDate = new Date(end_date);
            const now = new Date();

            if (startDate <= now) {
                return res.status(400).json({
                    success: false,
                    error: 'Start date must be in the future'
                });
            }

            if (endDate <= startDate) {
                return res.status(400).json({
                    success: false,
                    error: 'End date must be after start date'
                });
            }

            // Check if equipment exists and is available
            const equipment = await EquipmentModel.getById(equipment_id);
            if (!equipment) {
                return res.status(404).json({
                    success: false,
                    error: 'Equipment not found'
                });
            }

            if (equipment.availability_status !== 'Available') {
                return res.status(400).json({
                    success: false,
                    error: 'Equipment is not available for reservation'
                });
            }

            // Check availability for the requested date range
            const isAvailable = await ReservationModel.checkAvailability(
                equipment_id, start_date, end_date
            );

            if (!isAvailable) {
                return res.status(400).json({
                    success: false,
                    error: 'Equipment is not available for the selected date range'
                });
            }

            // For demo purposes, we'll use user_id = 1 (should come from JWT token in production)
            const user_id = req.user?.user_id || 1;

            const reservation = await ReservationModel.create({
                equipment_id,
                user_id,
                start_date,
                end_date,
                purpose: purpose || '',
                special_instructions: special_instructions || ''
            });

            res.status(201).json({
                success: true,
                message: 'Reservation created successfully',
                data: reservation
            });
        } catch (error) {
            console.error('Create reservation error:', error);
            res.status(500).json({
                success: false,
                error: 'Failed to create reservation'
            });
        }
    },

    // GET /api/reservations - Get all reservations with filters
    getAll: async (req, res) => {
        try {
            const limit = parseInt(req.query.limit) || 50;
            const offset = parseInt(req.query.offset) || 0;
            
            const filters = {};
            if (req.query.status) filters.status = req.query.status;
            if (req.query.equipment_id) filters.equipment_id = req.query.equipment_id;
            if (req.query.user_id) filters.user_id = req.query.user_id;
            if (req.query.date_from) filters.date_from = req.query.date_from;
            if (req.query.date_to) filters.date_to = req.query.date_to;

            const reservations = await ReservationModel.getAll(filters, limit, offset);
            
            res.json({
                success: true,
                message: 'Reservations retrieved successfully',
                data: reservations,
                count: reservations.length,
                filters,
                pagination: {
                    limit,
                    offset,
                    hasMore: reservations.length === limit
                }
            });
        } catch (error) {
            console.error('Get reservations error:', error);
            res.status(500).json({
                success: false,
                error: 'Failed to fetch reservations'
            });
        }
    },

    // GET /api/reservations/:id - Get single reservation
    getById: async (req, res) => {
        try {
            const { id } = req.params;
            const reservation = await ReservationModel.getById(id);
            
            if (!reservation) {
                return res.status(404).json({
                    success: false,
                    error: 'Reservation not found'
                });
            }
            
            res.json({
                success: true,
                message: 'Reservation retrieved successfully',
                data: reservation
            });
        } catch (error) {
            console.error('Get reservation by ID error:', error);
            res.status(500).json({
                success: false,
                error: 'Failed to fetch reservation'
            });
        }
    },

    // PUT /api/reservations/:id/status - Update reservation status
    updateStatus: async (req, res) => {
        try {
            const { id } = req.params;
            const { status } = req.body;
            
            if (!status) {
                return res.status(400).json({
                    success: false,
                    error: 'Status is required'
                });
            }

            const validStatuses = ['Pending', 'Approved', 'Active', 'Completed', 'Cancelled', 'Overdue'];
            if (!validStatuses.includes(status)) {
                return res.status(400).json({
                    success: false,
                    error: 'Invalid status'
                });
            }

            // For demo purposes, we'll use user_id = 1 as the approver (should come from JWT token)
            const approvedBy = (status === 'Approved') ? (req.user?.user_id || 1) : null;

            const reservation = await ReservationModel.updateStatus(id, status, approvedBy);
            
            if (!reservation) {
                return res.status(404).json({
                    success: false,
                    error: 'Reservation not found'
                });
            }
            
            res.json({
                success: true,
                message: `Reservation ${status.toLowerCase()} successfully`,
                data: reservation
            });
        } catch (error) {
            console.error('Update reservation status error:', error);
            res.status(500).json({
                success: false,
                error: 'Failed to update reservation status'
            });
        }
    },

    // GET /api/reservations/my - Get current user's reservations
    getUserReservations: async (req, res) => {
        try {
            const limit = parseInt(req.query.limit) || 20;
            const offset = parseInt(req.query.offset) || 0;
            
            // For demo purposes, we'll use user_id = 1 (should come from JWT token)
            const user_id = req.user?.user_id || 1;
            
            const reservations = await ReservationModel.getByUserId(user_id, limit, offset);
            
            res.json({
                success: true,
                message: 'User reservations retrieved successfully',
                data: reservations,
                count: reservations.length,
                pagination: {
                    limit,
                    offset,
                    hasMore: reservations.length === limit
                }
            });
        } catch (error) {
            console.error('Get user reservations error:', error);
            res.status(500).json({
                success: false,
                error: 'Failed to fetch user reservations'
            });
        }
    },

    // GET /api/reservations/statuses - Get available reservation statuses
    getStatuses: async (req, res) => {
        try {
            const statuses = await ReservationModel.getStatuses();
            res.json({
                success: true,
                message: 'Reservation statuses retrieved successfully',
                data: statuses
            });
        } catch (error) {
            console.error('Get reservation statuses error:', error);
            res.status(500).json({
                success: false,
                error: 'Failed to fetch reservation statuses'
            });
        }
    }
};

module.exports = reservationController;
