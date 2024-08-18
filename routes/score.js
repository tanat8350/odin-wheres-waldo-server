const express = require('express');
const router = express.Router();

const scoreController = require('../controllers/scoreController');

router.get('/', scoreController.get);

module.exports = router;
