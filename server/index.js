const express = require('express');
const logger = require('morgan');
const {
  getAllQuestions, getAllAnswers, addOneQuestion, addOneAnswer,
  markQHelpful, markAHelpful,
  reportQuestion, reportAnswer,
} = require('../database/index');
require('dotenv').config();

const app = express();
app.use(logger('tiny'));
app.use(express.json());

// get questions for a specific product
app.get('/qa/:productId', (req, res) => {
  const { page, count } = req.query;
  const { productId } = req.params;
  getAllQuestions(productId, page, count)
    .then((data) => {
      res.status(200).send(data);
    })
    .catch((err) => {
      console.log('getAllQuestions err', err);
      res.status(500);
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
      res.status(500).send();
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
      res.status(500);
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
      res.status(500);
    });
});

app.put('/qa/question/:questionId/helpful', (req, res) => {
  const { questionId } = req.params;
  markQHelpful(questionId)
    .then(() => {
      res.status(204).send();
    })
    .catch((err) => {
      console.log('make q helpful err', err);
      res.status(505);
    });
});

app.put('/qa/question/:questionId/report', (req, res) => {
  const { questionId } = req.params;
  reportQuestion(questionId)
    .then(() => {
      res.status(204).send();
    })
    .catch((err) => {
      console.log('report q err', err);
      res.status(505);
    });
});

app.put('/qa/answer/:answerId/helpful', (req, res) => {
  const { answerId } = req.params;
  markAHelpful(answerId)
    .then(() => {
      res.status(204).send();
    })
    .catch((err) => {
      console.log('make A helpful err', err);
      res.status(505);
    });
});

app.put('/qa/answer/:answerId/report', (req, res) => {
  const { answerId } = req.params;
  reportAnswer(answerId)
    .then(() => {
      res.status(204).send();
    })
    .catch((err) => {
      console.log('report A err', err);
      res.status(505);
    });
});

app.listen(process.env.PORT, () => {
  console.log(`server listen on ${process.env.PORT}`);
});
