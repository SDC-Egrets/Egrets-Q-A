const express = require('express');
const logger = require('morgan');
const {
  getAllQuestions, getAllAnswers, addOneQuestion, addOneAnswer,
} = require('../database/index');
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
  const { page, count } = req.query;
  const { questionId } = req.params;
  getAllAnswers(questionId, page, count)
    .then((data) => {
      res.status(200).send(data);
    })
    .catch((err) => {
      console.log('getAllAnswers err', err);
      res.status(505);
    });
});

// add a question for a specific product
app.post('/qa/:productId', (req, res) => {
  const {
    id, body, name, email,
  } = req.body;
  const { productId } = req.params;
  addOneQuestion(productId, body, name, email, id)
    .then(() => {
      res.status(201).send();
    })
    .catch((err) => {
      console.log('add one question err', err);
      res.status(505);
    });
});

// add an answer for a specific question
app.post('/qa/:questionId/answers', (req, res) => {
  const {
    id, body, name, email, photos,
  } = req.body;
  const { questionId } = req.params;
  addOneAnswer(questionId, body, name, email, photos, id)
    .then(() => {
      res.status(201).send();
    })
    .catch((err) => {
      console.log('add one answer err', err);
      res.status(505);
    });
});

app.listen(process.env.PORT, () => {
  console.log(`server listen on ${process.env.PORT}`);
});
