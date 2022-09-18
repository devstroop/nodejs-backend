const express = require('express');
const User = require('../models/user.model');
const bcryptjs = require('bcryptjs');
const jwt = require('jsonwebtoken');
const adminMiddleware = require('../middlewares/admin.middleware');

const adminRouter = express.Router();

/// Sign Up /
adminRouter.post('/api/test', adminMiddleware, async (req, res) => {
    res.json({ msg: 'TEST PASSED' });
});

module.exports = adminRouter;