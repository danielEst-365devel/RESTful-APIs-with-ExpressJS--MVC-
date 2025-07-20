const express = require('express');
const equipmentController = require('../controllers/dataController');
const reservationController = require('../controllers/reservationController');
const healthController = require('../controllers/healthController');

const router = express.Router();

// Health check routes
router.get('/health', healthController.getHealth);
router.get('/system/status', healthController.getSystemStatus);

// Equipment routes
router.get('/equipment', equipmentController.getAvailable);
router.get('/equipment/all', equipmentController.getAll);
router.get('/equipment/search', equipmentController.search);
router.get('/equipment/categories', equipmentController.getCategories);
router.get('/equipment/:id', equipmentController.getById);

// Reservation routes
router.get('/reservations', reservationController.getAll);
router.post('/reservations', reservationController.create);
router.get('/reservations/my', reservationController.getUserReservations);
router.get('/reservations/statuses', reservationController.getStatuses);
router.get('/reservations/:id', reservationController.getById);
router.put('/reservations/:id/status', reservationController.updateStatus);

module.exports = router;
