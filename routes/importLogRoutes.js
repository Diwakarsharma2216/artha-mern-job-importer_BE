const express = require('express');
const router = express.Router();
const importLogController = require('../controllers/importLogController');


router.get('/import-history', importLogController.getImportHistory);
router.get('/import-history/:id', importLogController.getImportLogById);

module.exports = router;
