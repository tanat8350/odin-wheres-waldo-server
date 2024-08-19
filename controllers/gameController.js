const asyncHandler = require('express-async-handler');
const prisma = require('../configs/prisma');
const { body, validationResult } = require('express-validator');

const MAX_DIFF_X = 50;
const MAX_DIFF_Y = 100;
const MAX_DIFF_DURATION = 10;

const validateResult = [
  body('imageid').isInt(),
  body('results').isArray(),
  body('results[*]').isString(),
  body('duration').isInt(),
];

const validatePlayerName = [
  body('player')
    .trim()
    .isLength({ min: 3, max: 255 })
    .withMessage('Name must be between 3 and 255 characters')
    .isAlphanumeric()
    .withMessage('Name must be alphanumeric'),
];

module.exports = {
  get: asyncHandler(async (req, res) => {
    const images = await prisma.image.findMany();
    if (images.length < 1) {
      return res
        .status(400)
        .json({ errors: [{ msg: 'Cannot find any image' }] });
    }
    const random = Math.floor(Math.random() * images.length);
    const game = await prisma.game.create({
      data: {
        imageid: images[random].id,
      },
    });
    if (!game) {
      return res.status(400).json({ errors: [{ msg: 'fail to create game' }] });
    }
    res.json({ ...images[random], gameid: game.id });
  }),

  postUpdateFinished: [
    validateResult,
    asyncHandler(async (req, res) => {
      const finishedTime = new Date();
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
      }
      const image = await prisma.image.findUnique({
        where: {
          id: +req.body.imageid,
        },
      });
      if (!image) {
        return res.status(400).json({ errors: [{ msg: 'Game not found' }] });
      }
      let resultValid = true;
      for (const [index, value] of req.body.results.entries()) {
        const [x, y] = value.split(',').map((value) => +value);
        const [ax, ay] = image.locations[index]
          .split(',')
          .map((value) => +value);
        if (Math.abs(x - ax > MAX_DIFF_X) || Math.abs(y - ay > MAX_DIFF_Y)) {
          resultValid = false;
          break;
        }
      }
      if (resultValid === true) {
        const updated = await prisma.game.update({
          where: {
            id: +req.params.id,
          },
          data: {
            finish: finishedTime,
          },
        });
        if (!updated) {
          return res
            .status(400)
            .json({ errors: [{ msg: 'fail to update game data' }] });
        }

        const comStartFinish = Math.floor(
          (updated.finish - updated.start) / 1000
        );
        if (Math.abs(comStartFinish - req.body.duration) > MAX_DIFF_DURATION) {
          const deletedInvalidGame = await prisma.game.delete({
            where: {
              id: +req.params.id,
            },
          });
          if (!deletedInvalidGame) {
            return res.status(400).json({
              errors: [{ msg: 'fail to delete invalid game' }],
            });
          }
          return res.status(400).json({
            errors: [{ msg: 'Something is wrong with the game' }],
          });
        }

        const updatedDuration = await prisma.game.update({
          where: {
            id: +req.params.id,
          },
          data: {
            duration: +req.body.duration,
          },
        });
        if (!updatedDuration) {
          return res
            .status(400)
            .json({ errors: [{ msg: 'fail to update duration' }] });
        }

        return res.json({ success: true });
      }
      return res.json({ success: false });
    }),
  ],
  putUpdatePlayerName: [
    validatePlayerName,
    asyncHandler(async (req, res) => {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
      }

      const updated = await prisma.game.update({
        where: {
          id: +req.params.id,
        },
        data: {
          player: req.body.player,
        },
      });
      if (!updated) {
        return res
          .status(400)
          .json({ errors: [{ msg: 'fail to update player name' }] });
      }
      res.json({ success: true });
    }),
  ],
};
