const { Queue, Worker } = require('bullmq');
require("dotenv").config()
const IORedis = require('ioredis');

const redisConnection = {
  host: process.env.REDIS_HOST,
  port: parseInt(process.env.REDIS_PORT),
  password: process.env.REDIS_PASSWORD,
   maxRetriesPerRequest: null, 
};

console.log(redisConnection)
const connection = new IORedis(redisConnection);

const jobImportQueue = new Queue('job-import-queue', { connection });

module.exports = {
  connection,
  jobImportQueue,
};
