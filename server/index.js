const express = require('express');
const logger = require('morgan');
const { getAllQuestions } = require('../database/index');
require('dotenv').config();

const app = express();
app.use(logger('tiny'));
app.use(express.json());

// get questions for a specific product
app.get('/qa/:productId', (req, res) => {
  getAllQuestions(req.params.productId)
    .then((data) => {
      res.status(200).send(data);
    })
    .catch((err) => {
      console.log('getAllQuestions err', err);
      res.status(505);
    });
});

// get answers for a specific question
app.get('/qa/:questionId/answers', (req, res) => {
  console.log(req.params.questionId);
  res.send('answers success');
});

// add a question for a specific product
app.post('/qa/:productId', (req, res) => {
  console.log(req.body);
  console.log(req.params.productId);
  res.send('success');
});

// add an answer for a specific question
app.post('/qa/:questionId/answers', (req, res) => {
  console.log(req.body);
  console.log(req.params.questionId);
  res.send('success');
});

app.listen(process.env.PORT, () => {
  console.log(`server listen on ${process.env.PORT}`);
});
