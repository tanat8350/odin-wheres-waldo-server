const prisma = require('../configs/prisma');
const asyncHandler = require('express-async-handler');

module.exports = {
  get: asyncHandler(async (req, res) => {
    const games = await prisma.game.findMany({
      orderBy: {
        duration: 'asc',
      },
      where: {
        duration: { not: null },
      },
    });
    res.json(games);
  }),
};
