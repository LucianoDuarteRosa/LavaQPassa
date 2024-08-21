const express = require('express');
const router = express.Router();
const exportController = require('../controllers/exportController');
const authMiddleware = require('../../middlewares/authMiddleware');


router.get('/export/alltables', authMiddleware.authMiddleware, exportController.alltables);

module.exports = router;
