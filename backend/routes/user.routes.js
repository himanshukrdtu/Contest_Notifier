const express = require('express');
const router = express.Router();
const { addUser } = require('../controllers/user.controllers');

router.post('/users', addUser); // POST /api/users

module.exports = router;
