const prisma = require('../configs/prisma');

const data = [
  {
    name: 'pic1',
    locations: ['430,1341', '686,1283', '418,1499'],
  },
  {
    name: 'pic2',
    locations: ['195,1644', '323,1441', '530,1687'],
  },
  {
    name: 'pic3',
    locations: ['389,1266', '224,1402', '520,1631'],
  },
];

const seed = (data) => {
  for (const { name, locations } of data) {
    prisma.image
      .create({
        data: {
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
