const prisma = require('../configs/prisma');

const data = [
  {
    id: 1,
    name: 'pic1',
    locations: ['425,1037', '688,980', '419,1206'],
  },
  {
    id: 2,
    name: 'pic2',
    locations: ['195,1343', '329,1138', '533,1389'],
  },
  {
    id: 3,
    name: 'pic3',
    locations: ['391,964', '222,1111', '517,1328'],
  },
];

const seed = (data) => {
  for (const { name, locations, id } of data) {
    prisma.image
      .upsert({
        where: { id },
        update: {
          id,
          name,
          locations,
        },
        create: {
          id,
          name,
          locations,
        },
      })
      .then((image) => {
        console.log(image);
      })
      .catch((error) => {
        console.log(error);
      });
  }
};

seed(data);
prisma.$disconnect();
