const { jobImportQueue } = require('../config/queue');
const ImportLog = require('../models/ImportLog');
const jobApiIntegrationService = require('./jobApiIntegrationService');

async function startJobImportProcess() {
  const jobs = await jobApiIntegrationService.fetchAndProcessAllFeeds();

  const log = await ImportLog.create({
    fileName: 'Combined Feed',
    totalFetched: jobs.length,
  });

  for (const jobData of jobs) {
    await jobImportQueue.add(
      'processJob',
      { jobData, importLogId: log._id },
      {
        attempts: 3,
        backoff: {
          type: 'exponential',
          delay: 1000,
        },
      }
    );
  }

  return { importLogId: log._id };
}

module.exports = { startJobImportProcess };
