const prisma = require('../configs/prisma');

const fn = async () => {
  const re = await prisma.game.update({
    where: {
      id: 9,
    },
    data: {
      duration: 10,
    },
  });
  console.log(re);
};

fn()
  .then(() => console.log('Done'))
  .catch((error) => console.log(error))
  .finally(() => prisma.$disconnect());
