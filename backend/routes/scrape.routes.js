// routes/scrape.routes.js
const express = require('express');
const router = express.Router();
const { scrapeAll } = require('../controllers/scrape.controller');

router.post('/scrape', scrapeAll);

module.exports = router;
