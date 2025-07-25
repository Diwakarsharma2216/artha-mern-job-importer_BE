const jobImportService = require('../services/jobImportService');
const jobApiIntegrationService = require('../services/jobApiIntegrationService');


const testFetchJobs = async (req, res) => {
  try {
    const jobs = await jobApiIntegrationService.fetchAndProcessAllFeeds();
    res.status(200).json({
      message: 'jobs fetched successfully',
      count: jobs.length,
      jobs,
    });
  } catch (err) {
    console.error('Failed to fetch jobs:', err.message);
    res.status(500).json({ error: 'Failed to fetch job feeds' });
  }
};


const triggerImport = async (req, res) => {
  try {
    const result = await jobImportService.startJobImportProcess();
    res.status(200).json({
      message: ' Import process started',
      importLogId: result.importLogId,
    });
  } catch (error) {
    console.error('Import Controller Error:', error.message);
    res.status(500).json({ error: 'Failed to start job import process' });
  }
};

module.exports = { testFetchJobs, triggerImport };
