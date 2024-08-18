const express = require('express');
const router = express.Router();

const gameController = require('../controllers/gameController');
/* GET home page. */
router.get('/', gameController.get);
router.post('/:id', gameController.post);
router.put('/:id', gameController.putUpdatePlayerName);

module.exports = router;
