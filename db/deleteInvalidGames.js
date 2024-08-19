const prisma = require('../configs/prisma');

const deleteUnfinished = async () => {
  await prisma.game.deleteMany({
    where: {
      duration: null,
    },
  });
};

deleteUnfinished()
  .then(() => console.log('Done'))
  .catch((error) => console.log(error))
  .finally(() => prisma.$disconnect());
