const express = require('express');
const cors = require('cors');
const {
  getAllQuestions, getAllAnswers, addOneQuestion, addOneAnswer,
  markQHelpful, markAHelpful,
  reportQuestion, reportAnswer,
} = require('../database/index');
require('dotenv').config();

const app = express();
app.use(express.json());
app.use(cors());
app.use('/loaderio-a4b51fd4efdc4d4f65a338681c2a6188.txt', express.static(__dirname + '/../loaderio-a4b51fd4efdc4d4f65a338681c2a6188.txt'));

app.get('/qa/:productId', (req, res) => {
  const { page, count } = req.query;
  const { productId } = req.params;
  getAllQuestions(productId, page, count)
    .then((data) => {
      res.status(200).send(data[0].json_build_object);
    })
    .catch((err) => {
      console.log(err);
      res.status(500).send(err);
    });
});

app.get('/qa/:questionId/answers', (req, res) => {
  const { page, count } = req.query;
  const { questionId } = req.params;
  getAllAnswers(questionId, page, count)
    .then((data) => {
      res.status(200).send(data);
    })
    .catch((err) => {
      res.status(500).send(err);
    });
});

app.post('/qa/:productId', (req, res) => {
  const {
    body, name, email,
  } = req.body;
  const { productId } = req.params;
  addOneQuestion(productId, body, name, email)
    .then(() => {
      res.status(201).send();
    })
    .catch((err) => {
      res.status(500).send(err);
    });
});

app.post('/qa/:questionId/answers', (req, res) => {
  const {
    body, name, email, photos,
  } = req.body;
  const { questionId } = req.params;
  addOneAnswer(questionId, body, name, email, photos)
    .then(() => {
      res.status(201).send();
    })
    .catch((err) => {
      res.status(500).send(err);
    });
});

app.put('/qa/question/:questionId/helpful', (req, res) => {
  const { questionId } = req.params;
  markQHelpful(questionId)
    .then(() => {
      res.status(204).send();
    })
    .catch((err) => {
      res.status(505).send(err);
    });
});

app.put('/qa/question/:questionId/report', (req, res) => {
  const { questionId } = req.params;
  reportQuestion(questionId)
    .then(() => {
      res.status(204).send();
    })
    .catch((err) => {
      res.status(505).send(err);
    });
});

app.put('/qa/answer/:answerId/helpful', (req, res) => {
  const { answerId } = req.params;
  markAHelpful(answerId)
    .then(() => {
      res.status(204).send();
    })
    .catch((err) => {
      res.status(505).send(err);
    });
});

app.put('/qa/answer/:answerId/report', (req, res) => {
  const { answerId } = req.params;
  reportAnswer(answerId)
    .then(() => {
      res.status(204).send();
    })
    .catch((err) => {
      res.status(505).send(err);
    });
});

app.listen(process.env.PORT, () => {
  console.log('success');
});
