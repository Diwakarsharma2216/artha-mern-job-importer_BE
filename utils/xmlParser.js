// server/utils/xmlParser.js

const xml2js = require('xml2js');

const parseXmlToJson = async (xmlData) => {
  try {
    const parser = new xml2js.Parser({ explicitArray: false });
    const jsonData = await parser.parseStringPromise(xmlData);
    return jsonData;
  } catch (error) {
    console.error("XML Parsing Failed:", error);
    throw error;
  }
};

module.exports = { parseXmlToJson };
