

const cron = require('node-cron');
const jobImportService = require('../services/jobImportService');

const startCronJobs = () => {
  
  cron.schedule('0 * * * *', async () => {
    console.log('Running hourly job import...');
    try {
      await jobImportService.startJobImportProcess();
      console.log('Hourly job import completed.');
    } catch (error) {
      console.error('Hourly job import failed:', error.message);
    }
  }, {
    scheduled: true,
    timezone: 'Asia/Kolkata' 
  });

  console.log('Cron job scheduled to run hourly.');
};

module.exports = startCronJobs;