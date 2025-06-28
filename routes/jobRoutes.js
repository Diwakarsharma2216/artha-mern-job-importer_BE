

const express = require('express');
const router = express.Router();
const { testFetchJobs, triggerImport } = require('../controllers/jobController');

router.get('/test-fetch', testFetchJobs);
router.get('/trigger-import', triggerImport);

module.exports = router;
