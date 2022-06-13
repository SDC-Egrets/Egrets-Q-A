const frisby = require('frisby');
const Joi = frisby.Joi;

it ('get questions for a product should return status 200', function () {
  return frisby
    .get('http://localhost:8000/qa/1')
    .expect('status', 200);
});

it ('get answers for a question should return status 200', function () {
  return frisby
    .get('http://localhost:8000/qa/1/answers')
    .expect('status', 200);
});

it ('Post a question should return a status of 201 Created', function () {
  return frisby
    .post('http://localhost:8000/qa/1', {body: {
      "name": 'frisby test',
      "email": 'test@gmail.com',
      "body": 'ly New Blog Post'
    }})
    .expect('status', 201);
});

it ('Post a answer should return a status of 201 Created', function () {
  return frisby
    .post('http://localhost:8000/qa/1/answers', {body: {
      "name": 'frisby test',
      "email": 'test@gmail.com',
      "body": 'ly New Blog Post',
      "photos": ['https://i.ytimg.com/vi/mRf3-JkwqfU/mqdefault.jpg']
    }})
    .expect('status', 201);
});

it ('Mark a question helpful should return a status of 204', function () {
  return frisby
    .put('http://localhost:8000/qa/question/11/helpful')
    .expect('status', 204);
});

it ('Mark a question reported should return a status of 204', function () {
  return frisby
    .put('http://localhost:8000/qa/question/11/report')
    .expect('status', 204);
});

it ('Mark a answer helpful should return a status of 204', function () {
  return frisby
    .put('http://localhost:8000/qa/answer/101/helpful')
    .expect('status', 204);
});

it ('Mark a answer reported should return a status of 204', function () {
  return frisby
    .put('http://localhost:8000/qa/answer/11/report')
    .expect('status', 204);
});