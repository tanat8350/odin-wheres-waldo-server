const request = require('supertest');
const express = require('express');
const app = express();

const game = require('../routes/game');

app.use(express.urlencoded({ extended: true }));
app.use('/', game);

test('game GET', (done) => {
  request(app).get('/').expect('Content-Type', /json/).expect(200, done);
});

const validResultImage3 = ['389,1266', '224,1402', '520,1631'];

// below finishedTime config require in gameController
test('duration within max', (done) => {
  request(app)
    .post('/9')
    .type('form')
    .send({
      imageid: 3,
      finishedTime: new Date('2024-08-18T12:31:10.817Z'),
      results: validResultImage3,
      duration: 20,
    })
    .expect(200, done);
});

test('duration exceeds max', (done) => {
  request(app)
    .post('/9')
    .type('form')
    .send({
      imageid: 3,
      finishedTime: new Date('2024-08-18T12:31:10.817Z'),
      results: validResultImage3,
      duration: 21,
    })
    .expect(400, done);
});
