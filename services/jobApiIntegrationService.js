

const axios = require('axios');
const { parseXmlToJson } = require('../utils/xmlParser');
const { JOB_FEED_URLS } = require('../config/constants');

const normalizeJob = (item) => {
  return {
    title: item.title || '',
    description: item.description || '',
    url: item.link || '',
    company: item['job:company'] || '',
    location: item['job:location'] || '',
    jobType: item['job:employmentType'] || '',
    category: item.category || '',
    externalId: item.guid?._ || item.guid || '',
    publishedAt: item.pubDate ? new Date(item.pubDate) : null,
  };
};

const fetchJobsFromApi = async (url) => {
  try {
    const response = await axios.get(url);
    const json = await parseXmlToJson(response.data);

    const items = json.rss?.channel?.item || [];
    const jobs = Array.isArray(items) ? items : [items];

    return jobs.map(normalizeJob);
  } catch (err) {
    console.error(`Error fetching from ${url}:`, err.message);
    return [];
  }
};

const fetchAndProcessAllFeeds = async () => {
  const allJobs = [];

  for (const url of JOB_FEED_URLS) {
    const jobs = await fetchJobsFromApi(url);
    allJobs.push(...jobs);
  }

  return allJobs;
};

module.exports = {
  fetchAndProcessAllFeeds,
};
