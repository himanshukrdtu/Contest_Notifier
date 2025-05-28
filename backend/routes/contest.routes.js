const express = require('express');
const router = express.Router();
const { getUpcomingContests, cleanupOldContests } = require('../controllers/contest.controller');

// Route for users (also deletes old)
router.get('/contests', getUpcomingContests);

// Route for GitHub Action / cleanup only
router.delete('/cleanup', cleanupOldContests);

module.exports = router;
