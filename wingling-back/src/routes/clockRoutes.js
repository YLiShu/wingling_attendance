const express = require('express');
const router = express.Router();
const { clockInController, clockOutController, exportClockController } = require('../controllers/clockController');

router.post('/clockIn', clockInController);
router.post('/clockOut', clockOutController);
router.get('/export', exportClockController);

module.exports = router;