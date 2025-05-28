const express = require('express');
const router = express.Router();
const { sendContestNotifications } = require('../controllers/notification.controller');

router.post('/notify-contests', sendContestNotifications);

module.exports = router;
