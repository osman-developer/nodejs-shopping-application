const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const User = require('../models/user');
const bycrpt = require('bcrypt');
const jwt = require('jsonwebtoken');
const UserController = require('../controllers/user')

router.post('/signup', UserController.user_signup);


router.post('/login', UserController.user_login);

router.delete('/:userId', UserController.user_delete_user);
module.exports = router;