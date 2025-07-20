const EquipmentModel = require('../models/dataModel');

// Equipment controller - handles equipment management endpoints
const equipmentController = {
    // GET /api/equipment - Get all available equipment
    getAvailable: async (req, res) => {
        try {
            const equipment = await EquipmentModel.getAvailable();
            res.json({
                success: true,
                message: 'Available equipment retrieved successfully',
                data: equipment,
                count: equipment.length
            });
        } catch (error) {
            console.error('Get available equipment error:', error);
            res.status(500).json({ 
                success: false,
                error: 'Failed to fetch available equipment' 
            });
        }
    },

    // GET /api/equipment/all - Get all equipment (with pagination)
    getAll: async (req, res) => {
        try {
            const limit = parseInt(req.query.limit) || 50;
            const offset = parseInt(req.query.offset) || 0;
            
            const equipment = await EquipmentModel.getAll(limit, offset);
            res.json({
                success: true,
                message: 'Equipment retrieved successfully',
                data: equipment,
                count: equipment.length,
                pagination: {
                    limit,
                    offset,
                    hasMore: equipment.length === limit
                }
            });
        } catch (error) {
            console.error('Get all equipment error:', error);
            res.status(500).json({ 
                success: false,
                error: 'Failed to fetch equipment' 
            });
        }
    },

    // GET /api/equipment/:id - Get single equipment item
    getById: async (req, res) => {
        try {
            const { id } = req.params;
            const equipment = await EquipmentModel.getById(id);
            
            if (!equipment) {
                return res.status(404).json({ 
                    success: false,
                    error: 'Equipment not found' 
                });
            }
            
            res.json({
                success: true,
                message: 'Equipment retrieved successfully',
                data: equipment
            });
        } catch (error) {
            console.error('Get equipment by ID error:', error);
            res.status(500).json({ 
                success: false,
                error: 'Failed to fetch equipment' 
            });
        }
    },

    // GET /api/equipment/search - Search equipment
    search: async (req, res) => {
        try {
            const { q: searchTerm, category } = req.query;
            
            if (!searchTerm || searchTerm.trim().length < 2) {
                return res.status(400).json({
                    success: false,
                    error: 'Search term must be at least 2 characters long'
                });
            }
            
            const equipment = await EquipmentModel.search(searchTerm.trim(), category);
            res.json({
                success: true,
                message: 'Search completed successfully',
                data: equipment,
                count: equipment.length,
                searchTerm: searchTerm.trim()
            });
        } catch (error) {
            console.error('Search equipment error:', error);
            res.status(500).json({ 
                success: false,
                error: 'Failed to search equipment' 
            });
        }
    },

    // GET /api/equipment/categories - Get equipment categories
    getCategories: async (req, res) => {
        try {
            const categories = await EquipmentModel.getCategories();
            res.json({
                success: true,
                message: 'Categories retrieved successfully',
                data: categories
            });
        } catch (error) {
            console.error('Get categories error:', error);
            res.status(500).json({ 
                success: false,
                error: 'Failed to fetch categories' 
            });
        }
    }
};

module.exports = equipmentController;
