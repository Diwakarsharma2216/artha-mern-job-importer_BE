const mongoose = require('mongoose');
const { Worker } = require('bullmq');
const Job = require('../models/Job');
const ImportLog = require('../models/ImportLog');
const { connection } = require('../config/queue');
const { io } = require('../index');

const concurrency = parseInt(process.env.JOB_WORKER_CONCURRENCY) || 5;

const jobWorker = new Worker(
  'job-import-queue',
  async (job) => {
    const { jobData, importLogId } = job.data;

    try {
      const existingJob = await Job.findOne({
        $or: [{ url: jobData.url }, { externalId: jobData.externalId }],
      });

      if (existingJob) {
        await Job.updateOne(
          { _id: existingJob._id },
          { $set: { ...jobData, updatedAt: new Date() } }
        );

        await ImportLog.updateOne(
          { _id: importLogId },
          { $inc: { updatedJobs: 1 } }
        );
      } else {
        await Job.create([jobData]);

        await ImportLog.updateOne(
          { _id: importLogId },
          { $inc: { newJobs: 1 } }
        );
      }

      const updatedLog = await ImportLog.findById(importLogId);
      io.emit('importLogUpdated', updatedLog); 
    } catch (err) {
      await ImportLog.updateOne(
        { _id: importLogId },
        {
          $inc: { failedJobs: 1 },
          $push: { failedReasons: `Job ${jobData.url}: ${err.message}` },
        }
      );
      throw err;
    }
  },
  { concurrency, connection }
);

jobWorker.on('completed', (job) =>
  console.log(`Job ${job.id} completed`)
);

jobWorker.on('failed', (job, err) =>
  console.error(`Job ${job.id} failed: ${err.message}`)
);
