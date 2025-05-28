// controllers/scrape.controller.js

// Import your scrapers 
const scrapeLeetcode = require('../scrape/leetcode');
const scrapeCodechef = require('../scrape/codechef');
const fetchCodeforces = require('../scrape/codeforce');

const scrapeAll = async (req, res) => {
  try {
    console.log("Starting Codechef scraping...");
    await scrapeCodechef();
    console.log("Starting Leetcode scraping...");
    await scrapeLeetcode();

   

    console.log("Starting Codeforces API fetch...");
    await fetchCodeforces();

    console.log("All scraping done successfully!");

    res.status(200).json({ message: '✅ Scraping completed successfully.' });
  } catch (err) {
    console.error("Error during scraping:", err);
    res.status(500).json({ error: '❌ Scraping failed.', details: err.message });
  }
};

module.exports = { scrapeAll };

