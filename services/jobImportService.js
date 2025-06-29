const { jobImportQueue } = require('../config/queue');
const ImportLog = require('../models/ImportLog');
const jobApiIntegrationService = require('./jobApiIntegrationService');

function generateFileName(jobs) {
  try {
    const sourceUrl = jobs[0]?.source || 'combined-feed';
    const url = new URL(sourceUrl);
    const domain = url.hostname.replace(/^www\./, '');
    const date = new Date().toISOString().split('T')[0];
    return `${domain}-${date}-feed.xml`;
  } catch {
    return `combined-${Date.now()}.xml`;
  }
}

async function startJobImportProcess() {
  const jobs = await jobApiIntegrationService.fetchAndProcessAllFeeds();

  if (!Array.isArray(jobs) || jobs.length === 0) {
    throw new Error('No jobs fetched from feeds.');
  }

  const fileName = generateFileName(jobs);

  const log = await ImportLog.create({
    fileName,
    importDateTime: new Date(),
    totalFetched: jobs.length,
    newJobs: 0,
    updatedJobs: 0,
    failedJobs: 0,
    failedReasons: [],
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
