const ImportLog = require("../models/ImportLog");


const getImportHistory = async (req, res) => {
  try {
    const logs = await ImportLog.find().sort({ importDateTime: -1 });
    res.status(200).json(logs);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch import history' });
  }
};


const getImportLogById = async (req, res) => {
  try {
    const log = await ImportLog.findById(req.params.id);
    if (!log) return res.status(404).json({ error: 'Import log not found' });
    res.status(200).json(log);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch import log' });
  }
};

module.exports = {
  getImportHistory,
  getImportLogById,
};
